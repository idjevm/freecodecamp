"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
const app = express();

// Basic Configuration
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_DB_URI;

// Connect to mongodb
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a shortURLSchema
const shorturlSchema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    short_url: {
        type: Number
    }
});

const SHORT_URL = mongoose.model("Shorturl", shorturlSchema);

// middleware
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use(cors());

if (!process.env.DISALBE_XORIGIN) {
    app.use((req, res, next) => {
        const allowedOrigins = [
            "https://narro-plane.gomix.me",
            "https://www.freecodecamp.com"
        ];
        const origin = req.header.origin || "*";

        if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > 1) {
            console.log(origin);
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept"
            );
        }
        next();
    });
}

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html");
});

// API endpoints...
app.get("/api/hello", (req, res) => {
    res.json({ greeting: "hello API" });
});

// validate url func
const isValidURL = url_str => {
    const pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", // fragment locator
        "i"
    );
    return !!pattern.test(url_str);
};

app.post("/api/shorturl/new", (req, res) => {
    const strURL = req.body.url;

    if (!isValidURL(strURL)) {
        return res.json({ error: "Invalid Hostname" });
    } else {
        SHORT_URL.countDocuments({}, (err, numOfExistentUrls) => {
            const urlNumber = numOfExistentUrls + 1;

            const newShortURL = new SHORT_URL({
                original_url: strURL,
                short_url: urlNumber
            });

            newShortURL.save((err, newUrl) => {
                if (err) {
                    return console.error(err);
                }
                return res.json({ original_url: strURL, short_url: urlNumber });
            });
        });
    }
});

app.get("/api/shorturl/:shorturl", (req, res) => {
    const shorturl = req.params.shorturl;

    SHORT_URL.find({ short_url: shorturl }, (err, url) => {
        if (err) {
            res.json({ error: "Shorturl does not exist yet" });
        }
        return res.redirect(url[0].original_url);
    });
});

app.listen(PORT, () => {
    console.log(`Nodejs is listening on por ${PORT}`);
});
