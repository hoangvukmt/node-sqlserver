'use strict';

var bodyParser = require('body-parser');
const express = require('express');
const systemConfig = require('config');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var xssFilters = require('xss-filters');

const UserController = require('../controllers/UserController');
const groupController = require('../controllers/GroupController');
const fileController = require('../controllers/FileController');
const keiyakuController = require('../controllers/KeiyakuController');
const messageController = require('../controllers/MessageController');
const agentController = require('../controllers/AgentController');
const vCompanyController = require('../controllers/VCompanyController');
const vProductController = require('../controllers/VProductController');
const vHoshoController = require('../controllers/VHoshoController');
const vTokuyakuController = require('../controllers/VTokuyakuController');
const bannerController = require('../controllers/BannerController');
const resultKaniShindanController = require('../controllers/ResultKaniShindanController');
const familyController = require('../controllers/FamilyController');
const resultShokenBunsekiController = require('../controllers/ResultShokenBunsekiController');
const selectItemController = require('../controllers/SelectItemController');
const fileRelationController = require('../controllers/FileRelationController');
const areaController = require('../controllers/AreaController');
const messageFileController = require('../controllers/MessageFileController');
const commonUtil = require('../util/common');

//check token is not required with register, login, reset password api...
//defined by below NotAuthen array
const NotAuthen = [
    '/server/api/login',
    '/server/api/register', 
    '/server/api/resetpass',
    '/server/api/getPageBanner',
    '/server/api/getFileBanner'
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

    if (orgUrl.substr(0, orgUrl.lastIndexOf('?')) === "/server/api/getFileImg") {
        token = req.query.token
    }
    else if (orgUrl.substr(0, orgUrl.lastIndexOf('?')) === "/server/api/getFileImgTemp") {
        token = req.query.token
    }
    else if (orgUrl.substr(0, orgUrl.lastIndexOf('?')) === "/server/api/getFileRelation") {
        token = req.query.token
    }
    else if (orgUrl === "/server/api/getPageBanner") {
        let startIndex = req.headers['referer'].lastIndexOf('/');
        let endIndex = req.headers['referer'].lastIndexOf('?') === -1 ? req.headers['referer'].length : req.headers['referer'].lastIndexOf('?');
        let url = req.headers['referer'].substr(startIndex, endIndex - startIndex);
        if (url !== "/register" && url !== "/login" && url !== "/forget-pass") {
            return res.status(401).send({ code: '401', message: 'No token provided.' });
        }
    }
    else if (orgUrl.substr(0, orgUrl.lastIndexOf('?')) === "/server/api/getFileBanner") {
        orgUrl = orgUrl.substr(0, orgUrl.lastIndexOf('?'));
        let startIndex = req.headers['referer'].lastIndexOf('/');
        let endIndex = req.headers['referer'].lastIndexOf('?') === -1 ? req.headers['referer'].length : req.headers['referer'].lastIndexOf('?');
        let url = req.headers['referer'].substr(startIndex, endIndex - startIndex);
        if (url !== "/register" && url !== "/login" && url !== "/forget-pass") {
            token = req.query.token
        }
    }
    else if (orgUrl.substr(0, orgUrl.lastIndexOf('?')) === "/server/api/getMessageImg") {
        token = req.query.token;
    }

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

/**
 * Register service API
 */
router.post('/api/register', function(req, res){
    return UserController.registerNewUser(req, res);
});

/**
 * Login API
 */
router.post('/api/login', function(req, res){
    return UserController.login(req, res)
});

/**
 * Reset password API
 */
router.post('/api/resetpass', function(req, res){
    return UserController.resetPassword(req, res);
});

/**
 * Change password API
 */
router.post('/api/changePassword', function(req, res){
    return UserController.changePassword(req, res);
});

/**
 * HIDE hokenshoken dialog
 */
router.post('/api/hidedialog', function(req, res){
    return UserController.hideDialog(req, res);
});

//#endregion

//#region family's APIS -----------------------------------------------------------------------------------

/**
 * GET FAMILY INFORMATION
 */
router.post('/api/getfamily', function(req, res){
    return familyController.getFamilyInfo(req, res);
});

/**
 * CREATE FAMILY INFORMATION
 */
router.post('/api/createfamily', function(req, res){
    return familyController.createFamilyInfo(req, res);
});

/**
 * UPDATE UserSelt, FAMILY INFORMATION
 */
router.post('/api/updatefamily', function(req, res){
    return familyController.updateFamilyInfo(req, res);
});

/**
 * Get list family
 */
router.post('/api/getListFamily', function(req, res){
    return familyController.getListFamily(req, res);
});

/**
 * Get info family
 */
router.post('/api/getInfoFamily', function(req, res){
    return familyController.getInfoFamily(req, res);
});

/**
 * delete family
 */
router.post('/api/deleteFamily', function(req, res){
    return familyController.deleteFamily(req, res);
});

//#endregion

//#region upload's APIS -----------------------------------------------------------------------------------

/**
* Upload file
*/
router.post('/api/uploadFile', function(req, res){
    return groupController.uploadFile(req, res, req.body.tokenData);
});

/**
* Get list file upload
*/
router.post('/api/getListFileUpload', function(req, res){
    return fileController.getListFile(req, res);
});

/**
* Get data file upload
*/
router.post('/api/getFileUpload', function(req, res){
    return fileController.getFileDetail(req, res);
});

/**
* Delete file upload
*/
router.post('/api/deleteFileUpload', function(req, res){
    return fileController.deleteFile(req, res);
});

/**
* update group
*/
router.post('/api/updateGroup', function(req, res){
    return groupController.updateGroup(req, res);
});

/**
* Get file img
*/
router.get('/api/getFileImg', function(req, res){
    return fileController.getFileImg(req, res);
});

/**
* Get temp file img
*/
router.get('/api/getFileImgTemp', function(req, res){
    return fileController.getFileImgTemp(req, res);
});

/**
* Create area image crop
*/
router.post('/api/createArea', function(req, res){
    return areaController.createArea(req, res);
});

/**
* Create area image crop
*/
router.post('/api/editImage', function(req, res){
    return groupController.editImage(req, res, req.body.tokenData);
});

//#endregion

//#region keiyaku's APIS ----------------------------------------------------------------------------------

/**
* get list Keiyaku
*/
router.post('/api/getListKeiyaku', function(req, res){
    return keiyakuController.getListKeiyaku(req, res);
});

/**
* get Keiyaku by user
*/
router.post('/api/getKeiyakuByUser', function(req, res){
    return keiyakuController.getKeiyakuByUser(req, res);
});

/**
* get detail Keiyaku
*/
router.post('/api/getDetailKeiyaku', function(req, res){
    return keiyakuController.getDetailKeiyaku(req, res);
});

/**
* create Keiyaku
*/
router.post('/api/createKeiyaku', function(req, res){
    return keiyakuController.createKeiyaku(req, res);
});

/**
* update Keiyaku
*/
router.post('/api/updateKeiyaku', function(req, res){
    return keiyakuController.updateKeiyaku(req, res);
});

/**
* delete Keiyaku
*/
router.post('/api/deleteKeiyaku', function(req, res){
    return keiyakuController.deleteKeiyaku(req, res);
});

//#endregion

//#region message's APIS ----------------------------------------------------------------------------------

/**
* get list message
*/
router.post('/api/getListMessage', function(req, res){
    return messageController.getListMessage(req, res);
});

/**
* get detail message
*/
router.post('/api/getDetailMessage', function(req, res){
    return messageController.getDetailMessage(req, res);
});

/**
* create message
*/
router.post('/api/createMessage', function(req, res){
    return messageController.createMessage(req, res);
});

/**
* update message status
*/
router.post('/api/updateMessageFlag', function(req, res){
    return messageController.updateMessageFlag(req, res);
});

/**
* Get message file img
*/
router.get('/api/getMessageImg', function(req, res){
    return messageFileController.getMessageImg(req, res);
});

//#endregion

//#region agent's APIS ------------------------------------------------------------------------------------

/**
* get list agent
*/
router.post('/api/getListAgent', function(req, res){
    return agentController.getListAgent(req, res);
});

/**
* create agent
*/
router.post('/api/createAgent', function(req, res){
    return agentController.createAgent(req, res);
});

/**
* get detail agent
*/
router.post('/api/getInfoAgent', function(req, res){
    return agentController.getInfoAgent(req, res);
});

/**
* delete agent
*/
router.post('/api/deleteAgent', function(req, res){
    return agentController.deleteAgent(req, res);
});

/**
* update agent
*/
router.post('/api/updateAgent', function(req, res){
    return agentController.updateAgent(req, res);
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

//#region vhosho's APIS -----------------------------------------------------------------------------------

/**
* get list vhosho
*/
router.post('/api/getListHosho', function(req, res){
    return vHoshoController.getListHosho(req, res);
});

/**
* get list vhosho tokuyaku
*/
router.post('/api/getListTokuyakuHosho', function(req, res){
    return vHoshoController.getListTokuyakuHosho(req, res);
});

/**
* get list vhosho tokuyaku
*/
router.post('/api/getListKeiyakuHosho', function(req, res){
    return vHoshoController.getListKeiyakuHosho(req, res);
});

//#endregion

//#region vtokuyaku's APIS --------------------------------------------------------------------------------

/**
* get list vtokuyaku
*/
router.post('/api/getListTokuyaku', function(req, res){
    return vTokuyakuController.getListTokuyaku(req, res);
});

//#endregion

//#region banner's APIS -----------------------------------------------------------------------------------

/**
* get list banner
*/
router.post('/api/getListBanner', function(req, res){
    return bannerController.getListBanner(req, res);
});

/**
* get page banner
*/
router.post('/api/getPageBanner', function(req, res){
    return bannerController.getListBanner(req, res);
});

/**
* Get file banner
*/
router.get('/api/getFileBanner', function(req, res){
    return bannerController.getFileBanner(req, res);
});

//#endregion

//#region get file pdf ------------------------------------------------------------------------------------

/**
* Get data file upload
*/
router.post('/api/getFilePdf', function(req, res){
    return fileController.getFilePdf(req, res);
});

//#endregion

//#region KaniShindan APIS --------------------------------------------------------------------------------

/**
* get KaniShindan info
*/
router.post('/api/getKaniShindanInfo', function(req, res){
    return resultKaniShindanController.getKaniShindanInfo(req, res);
});

//#endregion

//#region ShokenBunseki APIS ------------------------------------------------------------------------------

/**
* get List ShokenBunseki
*/
router.post('/api/getListShokenBunseki', function(req, res){
    return resultShokenBunsekiController.getListShokenBunseki(req, res);
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

//#region File relation APIS ------------------------------------------------------------------------------

/**
* get List File relation
*/
router.post('/api/getListFileRelation', function(req, res){
    return fileRelationController.getListFileRelation(req, res);
});

/**
* Get file img
*/
router.get('/api/getFileRelation', function(req, res){
    return fileRelationController.getFileRelation(req, res);
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