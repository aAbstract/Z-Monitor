// includes
const express = require('express');
const body_parser = require('body-parser');
const sql_dbm = require('sqlite3').verbose();

// global varialbes
const db_obj = new sql_dbm.Database('./database/z_monitor.db');
const debug = true;

// server settings
const server = express();
server.set('view engine', 'ejs');
server.use(body_parser.urlencoded({
    extended: false
}));
server.use(body_parser.json())
if (debug) {
    server.use((req, res, next) => {
        console.log(`[DEBUG]: ${req.method} ${req.url}`);
        console.log(`[DEBUG]: ${JSON.stringify(req.body)}`);
        next();
    });
    console.log('[INFO]: attached debug middleware');
}

// server routes
server.get('/', (req, res) => {
    res.render('main');
});

server.post('/api/private/auth', (req, res) => {
    // ESLAM-TODO: auth algorithm
});

server.post('/api/private/data', (req, res) => {
    // EHAB-TODO: private api logic
});

server.post('/api/public/:api_id', (req, res) => {
    const _api_id = req.params.api_id; // public api id
    // EHAB-TODO: public api logic
});

// server entry point
server.listen(process.env.PORT || 3000);
if (debug)
    console.log(`[INFO]: server started on 127.0.0.1:${process.env.PORT || 3000}`);
