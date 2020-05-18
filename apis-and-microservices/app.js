'use strict';
// dotenv for .env
require('dotenv').config()

// init project
const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({ optionSuccessStatus: 200 }));  // some legacy browsers choke on 204

if (!process.env.DISALBE_XORIGIN) {
    app.use((req, res, next) => {
        const allowedOrigins = ['https://narro-plane.gomix.me', 'https://www.freecodecamp.com'];
        const origin = req.header.origin || '*';

        if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > 1) {
            console.log(origin);
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        }
        next();
    });
}

// static files
app.use(express.static('public'));

// server index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//  API endpoints
app.get("/api/hello", (req, res) => {
    res.json({ greeting: 'hello API' });
});

// listen for requests :)

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});

