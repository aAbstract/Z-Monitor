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
server.use('/source', express.static('./assets'));
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
require('./routes/main_route')(server, db_obj);
require('./routes/login_route')(server, db_obj);
require('./routes/signup_route')(server, db_obj);
require('./routes/add_kpi_route')(server, db_obj);

// api routes
require('./routes/auth_route')(server, db_obj);
require('./routes/private_api_route')(server, db_obj);
require('./routes/public_api_route')(server, db_obj);

// server entry point
server.listen(process.env.PORT || 3000);
if (debug)
    console.log(`[INFO]: server started on 127.0.0.1:${process.env.PORT || 3000}`);
