'use strict';

var bodyParser = require('body-parser');
const express = require('express');
const systemConfig = require('config');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var xssFilters = require('xss-filters');

const UserController = require('../controllers/UserController');
const commonUtil = require('../util/common');

//check token is not required with register, login, reset password api...
//defined by below NotAuthen array
const NotAuthen = [
    '/server/api/login',
    '/server/api/create'
];

var router = express.Router();

// for using http json, urlencode
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(cors());

//#region check token -------------------------------------------------------------------------------------
/**
 * Check TOKEN middleware
 * All of request must be call this function
 */
router.use(function (req, res, next) {
    var token = req.headers['x-access-token'];
    let orgUrl = req.originalUrl;
    
    // xss filter
    Object.keys(req.body).forEach(function(key, index) {
        if (typeof req.body[key] !== "undefined" && req.body[key] !== null) {
            if (!commonUtil.stringIsNumber(req.body[key])) {
                //req.body[key] = xssFilters.inHTMLData(req.body[key]);
            }
        }
    });

    if (NotAuthen.indexOf(orgUrl) >= 0) {
        return next();
    }
    if (!token) {
        return res.status(401).send({ code: '401', message: 'No token provided.' });
    } else {
        //check validate token
        jwt.verify(token,systemConfig.get('TestENV.token.seed'), function(err, decoded){
            if (err) return res.status(401).json({
                code: '401',
                message: 'Failed to authenticate token.'
            });
            req.body.tokenData = decoded;
            return next();
        });
    }
});
//#endregion

//#region user's API --------------------------------------------------------------------------------------
router.post('/api/login', function(req, res){
    return UserController.login(req, res)
});
router.post('/api/create', function(req, res){
    return UserController.create(req, res)
})
router.post('/api/update', function(req, res) {
    return UserController.updateById(req, res)
})
router.post('/api/export', function(req, res) {
    return UserController.exportData(req, res)
})
//#endregion

//#region error handle ------------------------------------------------------------------------------------
router.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).json({
        ok: false,
        message: 'Server error!'
    });
});
router.use(function (req, res, next) {
    res.status(404).send('NotFound URL!');
})
//#endregion

module.exports = router;