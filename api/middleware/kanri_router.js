'use strict';

var bodyParser = require('body-parser');
const express = require('express');
const systemConfig = require('config');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var xssFilters = require('xss-filters');

const riyoController = require('../controllers/RiyoController');
const userController = require('../controllers/UserController');
const resultKaniShindanController = require('../controllers/ResultKaniShindanController');
const keiyakuController = require('../controllers/KeiyakuController');
const messageController = require('../controllers/MessageController');
const fileController = require('../controllers/FileController');
const vAgentController = require('../controllers/VAgentController');
const selectItemController = require('../controllers/SelectItemController');
const fileRelationController = require('../controllers/FileRelationController');
const haishinLogController = require('../controllers/HaishinLogController');
const messageFileController = require('../controllers/MessageFileController');
const vHoshoController = require('../controllers/VHoshoController');
const familyController = require('../controllers/FamilyController');
const agentController = require('../controllers/AgentController');
const vCompanyController = require('../controllers/VCompanyController');
const vProductController = require('../controllers/VProductController');
const vTokuyakuController = require('../controllers/VTokuyakuController');
const commonUtil = require('../util/common');

//defined by below NotAuthen array
const NotAuthen = [
    '/kanri/api/login'
];

var router = express.Router();

// for using http json, urlencode
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(cors());

//#region check token -------------------------------------------------------------------------------------

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

    if (orgUrl.substr(0, orgUrl.lastIndexOf('?')) === "/kanri/api/getFileImg") {
        token = req.query.token;
    }
    else if (orgUrl.substr(0, orgUrl.lastIndexOf('?')) === "/kanri/api/getFileRelation") {
        token = req.query.token;
    }
    else if (orgUrl.substr(0, orgUrl.lastIndexOf('?')) === "/kanri/api/getMessageImg") {
        token = req.query.token;
    }

    if (NotAuthen.indexOf(orgUrl) >= 0) {
        return next();
    }
    if (!token) {
        return res.status(401).send({ code: '401', message: 'No token provided.' });
    } else {
        //check validate token
        jwt.verify(token, systemConfig.get('TestENV.token.seed'), function(err, decoded){
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

/**
 * Login API
 */
router.post('/api/login', function(req, res){
    return userController.kanriLogin(req, res);
});

/**
* search customer
*/
router.post('/api/searchCustomer', function(req, res){
    return userController.searchCustomer(req, res);
});

/**
 * Authen guard
 */
router.post('/api/getUserInfo', function(req, res){
    return userController.getUserInfo(req, res);
});

/**
 * Update customer
 */
router.post('/api/updateCustomer', function(req, res){
    return userController.updateCustomer(req, res);
});

/**
 * Delete customer
 */
router.post('/api/deleteCustomer', function(req, res){
    return userController.deleteCustomer(req, res);
});

/**
* search target customer
*/
router.post('/api/searchTargetCustomer', function(req, res){
    return userController.searchTargetCustomer(req, res);
});

/**
 * Get customer info
 */
router.post('/api/getCustomerInfo', function(req, res){
    return userController.getCustomerInfo(req, res);
});

/**
 * Get list family
 */
router.post('/api/getListFamily', function(req, res){
    return familyController.getListFamily(req, res);
});

//#endregion

//#region KaniShindan APIS --------------------------------------------------------------------------------

/**
* get KaniShindan info
*/
router.post('/api/getKaniShindanInfo', function(req, res){
    return resultKaniShindanController.getKaniShindanInfo(req, res);
});

/**
* update KaniShindan info
*/
router.post('/api/updateKaniShindanInfo', function(req, res){
    return resultKaniShindanController.updateKaniShindanInfo(req, res);
});

//#endregion

//#region Keiyaku APIS ------------------------------------------------------------------------------------

/**
 * get List Product By User
 */
router.post('/api/getListProductByUser', function(req, res){
    return keiyakuController.getListProductByUser(req, res);
});

/**
 * get Product Detail
 * not using
 */
router.post('/api/getProductDetail', function(req, res){
    return keiyakuController.getProductDetail(req, res);
});

/**
 * request OCR
 */
router.post('/api/requestOCRList', function(req, res){
    return keiyakuController.requestOCRList(req, res);
});

/**
 * delete OCR
 */
router.post('/api/deleteOCRList', function(req, res){
    return keiyakuController.deleteOCRList(req, res);
});

/**
 * get Product Detail
 */
router.post('/api/getProductByKeiyakuno', function(req, res){
    return keiyakuController.getProductByKeiyakuno(req, res);
});

/**
 * send Keiyaku To IQSystem/ASSystem
 */
router.post('/api/sendKeiToSystem', function(req, res){
    return keiyakuController.sendKeiToSystem(req, res);
});

/**
* get list vtokuyaku
*/
router.post('/api/getListTokuyaku', function (req, res) {
    return vTokuyakuController.getListTokuyaku(req, res);
});

router.post('/api/processKeiyakuAuto', function (req, res) {
    return keiyakuController.processKeiyakuAuto(req, res);
});

//#endregion

//#region Message APIS ------------------------------------------------------------------------------------

/**
 * get getListMessage
 */
router.post('/api/getListMessage', function(req, res){
    return messageController.getMessageByIdOrUser(req, res);
});

/**
* search message
*/
router.post('/api/searchMessage', function(req, res){    
    return messageController.searchMessage(req, res);
});

/**
* send message
*/
router.post('/api/sendMessage', function(req, res){    
    return messageController.sendMessage(req, res);
});

/**
* upload image
*/
router.post('/api/messageImageUpload', function (req, res) {
    return messageFileController.uploadFile(req, res, req.body.tokenData)
});

/**
* Get message file img
*/
router.get('/api/getMessageImg', function(req, res){
    return messageFileController.getMessageImg(req, res);
});

/**
* Get data file upload
*/
router.post('/api/getFilePdf', function(req, res){
    return fileController.getFilePdf(req, res);
});

//#endregion

//#region Image APIS --------------------------------------------------------------------------------------

/**
* Get list file upload
*/
router.post('/api/getListFileUpload', function(req, res){
    return fileController.getListFile(req, res);
});

/**
 * get get list image
 */
router.post('/api/getListImage', function(req, res){
    return fileController.getListImage(req, res);
});

/**
* Get file img
*/
router.get('/api/getFileImg', function(req, res){
    return fileController.getImgUpload(req, res);
});

/**
* Delete file upload
*/
router.post('/api/deleteFileUpload', function(req, res){
    return fileController.kanriDeleteFile(req, res);
});

/**
* Delete file relation upload
*/
router.post('/api/deleteFileRelationUpload', function(req, res){
    return fileRelationController.kanriDeleteFileRelation(req, res);
});

/**
* Upload file
*/
router.post('/api/uploadFileRelation', function(req, res){
    return fileRelationController.uploadFileRelation(req, res, req.body.tokenData);
});

/**
* Get file img
*/
router.get('/api/getFileRelation', function(req, res){
    return fileRelationController.getFileRelation(req, res);
});

//#endregion

//#region VAgent's APIS ------------------------------------------------------------------------------------

/**
 * get list agent
 */
router.post('/api/getListAgent', function(req, res){
    return vAgentController.getListAgent(req, res);
});

//#endregion

//#region Agent's APIS ------------------------------------------------------------------------------------

/**
* get list agent
*/
router.post('/api/getCustomerAgent', function (req, res) {
    return agentController.getListAgent(req, res);
});

/**
* create agent
*/
router.post('/api/createAgent', function (req, res) {
    return agentController.createCustomerAgent(req, res);
});

//#endregion

//#region SelectItem APIS ---------------------------------------------------------------------------------

/**
* get List SelectItem
*/
router.post('/api/getListSelectItem', function(req, res){
    return selectItemController.getListSelectItem(req, res);
});

//#endregion

//#region Riyo APIS ---------------------------------------------------------------------------------------

/**
* search riyo
*/
router.post('/api/searchRiyo', function(req, res){
    return riyoController.searchRiyo(req, res);
});

//#endregion

//#region HaishinLog APIS ---------------------------------------------------------------------------------

/**
* search target list
*/
router.post('/api/searchHaishinLog', function(req, res){    
    return haishinLogController.searchHaishinLog(req, res);
});

/**
* get HaishinLog Detail
*/
router.post('/api/getHaishinLogDetail', function(req, res){    
    return haishinLogController.getHaishinLogDetail(req, res);
});

/**
* Upload file
*/
router.post('/api/haishinLogUpload', function(req, res){
    return haishinLogController.haishinLogUpload(req, res, req.body.tokenData);
});

/**
* create Haishinlog
*/
router.post('/api/createHaishinlog', function(req, res){    
    return haishinLogController.createHaishinlog(req, res);
});

//#endregion

//#region vhosho's APIS -----------------------------------------------------------------------------------

/**
* get list vhosho tokuyaku
*/
router.post('/api/getListKeiyakuHosho', function(req, res){
    return vHoshoController.getListKeiyakuHosho(req, res);
});

/**
* get list vhosho
*/
router.post('/api/getListHosho', function(req, res){
    return vHoshoController.getListHosho(req, res);
});

//#endregion

//#region vcompany's APIS ---------------------------------------------------------------------------------

/**
* get list vcompany
*/
router.post('/api/getListCompany', function(req, res){
    return vCompanyController.getListCompany(req, res);
});

//#endregion

//#region vproduct's APIS ---------------------------------------------------------------------------------

/**
* get list vproduct
*/
router.post('/api/getListProduct', function(req, res){
    return vProductController.getListProduct(req, res);
});

//#endregion

//#region error handle ------------------------------------------------------------------------------------

/**
 * Catch server err for request
 */
router.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).json({
        ok: false,
        message: 'Server error!'
    });
});

/**
 * Catch 404 err for request
 */
router.use(function (req, res, next) {
    res.status(404).send('NotFound URL!');
})

//#endregion

module.exports = router;