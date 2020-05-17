"use strict";
// init project
require('dotenv').config()
const express = require("express");
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// to allow requests from any place including FCC
const cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

if (!process.env.DISALBE_XORIGIN) {
  app.use((req, res, next) => {
    const allowedOrigins = [
      "https://narro-plane.gomix.me",
      "https://www.freecodecamp.com"
    ];
    const origin = req.header.origin || "*";

    if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > 1) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    }
    next();
  });
}

Date.prototype.isValid = () => {
  // An invalid date object returns NaN for getTime() and NaN is the only
  // object not strictly equal to itself.
  return this.getTime() === this.getTime();
};

// static files
app.use(express.static("public"));

// server index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//  API endpoints
app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

// endpoint to return timestamp
app.get("/api/timestamp/:date_string?", (req, res) => {
  const dateString = req.params.date_string;

  if (dateString) {
    if (!isNaN(dateString)) {
      const unix_timestamp = parseInt(dateString);
      const date = new Date(unix_timestamp);
      return res.json({ unix: date.getTime(), utc: date.toUTCString() });
    }
    const date = new Date(dateString);

    if (!date.isValid()) {
      if (/^\s+$/.test(dateString)) {
        res.json({ unix: date.getTime(), utc: date.toUTCString() });
      } else {
        res.json({ error: "Invalid Date" });
      }
    } else if (isNaN(dateString)) {
      res.json({ unix: date.getTime(), utc: date.toUTCString() });
    }
  } else {
    const date = new Date();
    res.json({ unix: date.getTime(), utc: date.toUTCString() });
  }
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});