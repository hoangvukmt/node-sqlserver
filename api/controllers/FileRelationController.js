const multer  = require('multer');
const fs = require('fs');
const systemConfig = require('config');

const fileService = require('../services/FileRelationService');
const logService = require('../services/LogService');
const validation = require('../util/validation');
const ResCode = require('../util/validation').RESPONSE_CODE;
const commonUtil = require('../util/common');

async function getListFileRelation(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        tokenData: request.body.tokenData
    }
    let result = await fileService.getListFileRelation(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FileRelationController.js" },
        { key: "Function", content: "getListFileRelation" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function getFileRelation(request, response) {
    let startTime = new Date();
    let requiredFields = [
        'user_no',
        'file_name'
    ];
    let checkRequired = validation.checkRequiredFields(request.query, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        let endTime = new Date();
        let logData = [
            { key: "Start time", content: startTime },
            { key: "End time", content: endTime },
            { key: "File", content: "FileRelationController.js" },
            { key: "Function", content: "getFileRelation" },
            { key: "Param", content: JSON.stringify(request.query) }
        ]
        logService.accessLog(logData);

        return response.json(result);
    }

    let objFile = {
        UserNo: request.query.user_no,
        FileName: request.query.file_name
    }
    let result = await fileService.getListFileRelation(objFile);
    if (result.code === ResCode.SUCCESS && result.data.length > 0) {

        fs.readFile(systemConfig.get('TestENV.relationPath') + '/' + result.data[0].FilePath + '/' + result.data[0].FileName, function (err, data) {
            if (err) {
                return response.json({
                    code: ResCode.SERVER_ERROR,
                    message:'Server error!'
                });
            };
            let endTime = new Date();
            let logData = [
                { key: "Start time", content: startTime },
                { key: "End time", content: endTime },
                { key: "File", content: "FileRelationController.js" },
                { key: "Function", content: "getFileRelation" },
                { key: "Param", content: JSON.stringify(objFile) }
            ]
            logService.accessLog(logData);
            response.end(data);
        });
    }
    else {
        let endTime = new Date();
        let logData = [
            { key: "Start time", content: startTime },
            { key: "End time", content: endTime },
            { key: "File", content: "FileController.js" },
            { key: "Function", content: "getFileImg" },
            { key: "Param", content: JSON.stringify(objFile) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return response.json(result);
    }
}

//#region only kanri -------------------------------------------------------------------------------------
async function uploadFileRelation(req, res, tokenData) {
    var dateNow = new Date();
    var folderName;
    var fileNameLocal;

    var storage = multer.diskStorage({
        destination: async (request, file, cb) => {
            let data = {
                UserNo: request.body.user_no
            }
            let requiredFields = [
                "UserNo"
            ]
            let checkRequired = validation.checkRequiredFields(data, requiredFields);
            if (checkRequired.required) {
                let result = {
                    code: ResCode.REQUIRED,
                    message: 'Parameter(s) is required!',
                    data: checkRequired
                };
                return res.json(result);
            }

            folderName = data.UserNo;
            
            if (!fs.existsSync(systemConfig.get('TestENV.relationPath'))){
                fs.mkdirSync(systemConfig.get('TestENV.relationPath'));
            }
            if (!fs.existsSync(systemConfig.get('TestENV.relationPath') + '/' + folderName)){
                fs.mkdirSync(systemConfig.get('TestENV.relationPath') + '/' + folderName);
            }
            if (!fs.existsSync(systemConfig.get('TestENV.relationPath') + '/' + folderName + '/relation')){
                fs.mkdirSync(systemConfig.get('TestENV.relationPath') + '/' + folderName + '/relation');
            }
            var filePath = systemConfig.get('TestENV.relationPath') + '/' + folderName + '/relation';
            cb(null, filePath);
        },
        filename: async (request, file, cb) => {
            var fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.'));
            fileNameLocal = '画像' + commonUtil.dateToyyyyMMddHHmmssii(dateNow) + fileExtension;
            cb(null, fileNameLocal);
        }
    });

    let upload = multer({
        storage: storage,
        fileFilter: async function (req, file, cb) {
            let data = {
                UserNo: req.body.user_no
            }
            let requiredFields = [
                'UserNo'
            ]
            let checkRequired = validation.checkRequiredFields(data, requiredFields);
            if (checkRequired.required) {
                cb(null, false);
            }
            else {
                cb(null, true);
            }
        }
    }).single('file_img');

    upload(req, res, async function(err) {
        let dataValidate = {
            UserNo: req.body.user_no
        }
        let requiredFields = [
            'UserNo'
        ]
        let checkRequired = validation.checkRequiredFields(dataValidate, requiredFields);
        if (checkRequired.required) {
            let result = {
                code: ResCode.REQUIRED,
                message: 'Parameter(s) is required!',
                data: checkRequired
            };
            return res.json(result);
        }

        var fileNameDb = '画像' + commonUtil.dateToyyyyMMddHHmm(dateNow);
        let data = {
            UserNo: req.body.user_no,
            FilePath: folderName + '/relation',
            FileName: fileNameLocal,
            MenuFileName: fileNameDb,
            tokenData: tokenData
        }
        let result = await fileService.createFile(data);
        let endTime = new Date();
        let logData = [
            { key: "Start time", content: dateNow },
            { key: "End time", content: endTime },
            { key: "File", content: "FileRelationController.js" },
            { key: "Function", content: "uploadFileRelation" },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return res.json(result);
    });
}

async function kanriDeleteFileRelation(request, response) {
    let startTime = new Date();
    let objFile = {
        UserNo: request.body.user_no,
        FileName: request.body.file_name,
        tokenData: request.body.tokenData
    }
    let result = await fileService.kanriDeleteFileRelation(objFile);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FileController.js" },
        { key: "Function", content: "kanriDeleteFile" },
        { key: "Param", content: JSON.stringify(objFile) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}
//#endregion

module.exports = {
    getListFileRelation,
    getFileRelation,
    uploadFileRelation,
    kanriDeleteFileRelation
}