'use_strict';

const express = require('express');
const db = require('./api/util/db_util');
const router = require('./api/middleware/app_router');
const kanriRouter = require('./api/middleware/kanri_router');
var app = express();

async function startServer() {
    let dbConnect = await db.dbConnect();
    if(dbConnect) {
        console.log('Connected to DB.....Server started!');
    }else {
        console.log('Connect to DB fail! Server stopped!');
        process.exit(1);
    }
}

if (typeof process.env.NODE_ENV === "undefined" || process.env.NODE_ENV.trim() !== "test"){
    startServer();
}
// use static for route of front-end
app.use('/', express.static('./front'));
app.use('/register', express.static('./front'));
app.use('/forget-pass', express.static('./front'));

// use static for route of kanri-system
app.use('/admin', express.static('./kanri'));
app.use('/admin/login', express.static('./kanri'));

// use authen for route of back-end
app.use('/server', router);
app.use('/kanri', kanriRouter);
app.listen(3000);


/**
 * Catch 404 err for request
 * redirect to front-end
 */
app.use(function (req, res, next) {
    res.redirect('/');
});

module.exports = app;
