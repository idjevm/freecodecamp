'use strict';
const fs = require('fs'); 
const express = require('express'); 
require('dotenv').config()

const app = express();

const PORT = process.env.PORT;

if(!process.env.DISALBE_XORIGIN) {
    app.use((req, res, next) => {
        const allowedOrigins = ['https://narro-plane.gomix.me', 'https://www.freecodecamp.com'];
        const origin = req.header.origin || '*';

        if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > 1) {
            console.log(origin); 
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        }
        next();
    });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
    .get((req, res, next) => {
        console.log('requested');
        fs.readFile(__dirname + '/package.json', (err, data) => {
            if(err) {
                next(err);
            }
            res.type('txt').send(data.toString());
        })
    });

app.route('/')
    .get((req, res) => {
        res.sendFile(process.cwd + '/views/index.html');
    });

// Respond Not Found if all the wrong routes
app.use((req, res, next) => {
    res.status(404);
    res.type('txt').send('Not found');
});

// Erros Middleware
app.use((err, req, res, next) => {
    if(err) {
        res.status(err.status || 500)
            .type('txt')
            .send(err.message || 'SEVER ERROR');
    }
});

app.listen(PORT, () => {
    console.log(`Node.js is listing on port ${PORT}`);
});

