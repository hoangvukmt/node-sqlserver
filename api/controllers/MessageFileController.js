const multer  = require('multer');
const fs = require('fs');
const systemConfig = require('config');
const service = require('../services/MessageFileService');
const resultShokenBunsekiService = require('../services/ResultShokenBunsekiService');
const logService = require('../services/LogService');
const commonUtil = require('../util/common');
const validation = require('../util/validation');
const ResCode = require('../util/validation').RESPONSE_CODE;

//#region only kanri -------------------------------------------------------------------------------------
async function uploadFile(req, res, tokenData) {
    var dateNow = new Date();
    var folderName;
    var fileNameLocal;
    var fileType;

    var storage = multer.diskStorage({
        destination: async (request, file, cb) => {
            let data = {
                MessageNo: request.body.message_no,
                UserNo: request.body.user_no
            }
            let requiredFields = [
                "MessageNo",
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
            if (!fs.existsSync(systemConfig.get('TestENV.messagePath'))){
                fs.mkdirSync(systemConfig.get('TestENV.messagePath'));
            }
            if (!fs.existsSync(systemConfig.get('TestENV.messagePath') + '/' + folderName)){
                fs.mkdirSync(systemConfig.get('TestENV.messagePath') + '/' + folderName);
            }
            var fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.'));
            var filePath;
            if (fileExtension.toUpperCase() === ".PDF"){
                fileType = "PDF";
                if (!fs.existsSync(systemConfig.get('TestENV.messagePath') + '/' + folderName + '/pdf')){
                    fs.mkdirSync(systemConfig.get('TestENV.messagePath') + '/' + folderName + '/pdf');
                }
                if (!fs.existsSync(systemConfig.get('TestENV.messagePath') + '/' + folderName + '/pdf/' + data.MessageNo)){
                    fs.mkdirSync(systemConfig.get('TestENV.messagePath') + '/' + folderName + '/pdf/' + data.MessageNo);
                }
                filePath = systemConfig.get('TestENV.messagePath') + '/' + folderName + '/pdf/' + data.MessageNo;
                folderName = data.UserNo + '/pdf/' + data.MessageNo;
            }
            else {
                fileType = "IMAGE";
                if (!fs.existsSync(systemConfig.get('TestENV.messagePath') + '/' + folderName + '/message')){
                    fs.mkdirSync(systemConfig.get('TestENV.messagePath') + '/' + folderName + '/message');
                }
                if (!fs.existsSync(systemConfig.get('TestENV.messagePath') + '/' + folderName + '/message/' + data.MessageNo)){
                    fs.mkdirSync(systemConfig.get('TestENV.messagePath') + '/' + folderName + '/message/' + data.MessageNo);
                }
                filePath = systemConfig.get('TestENV.messagePath') + '/' + folderName + '/message/' + data.MessageNo;
                folderName = data.UserNo + '/message/' + data.MessageNo;
            }
            
            cb(null, filePath);
        },
        filename: async (request, file, cb) => {
            var fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.'));
            if (fileExtension.toUpperCase() === ".PDF"){
                fileNameLocal = commonUtil.dateToyyyyMMddHHmmssii(dateNow) + fileExtension;
            }
            else {
                fileNameLocal = '画像' + commonUtil.dateToyyyyMMddHHmmssii(dateNow) + fileExtension;
            }
            
            cb(null, fileNameLocal);
        }
    });

    let upload = multer({
        storage: storage,
        fileFilter: async function (req, file, cb) {
            let data = {
                MessageNo: req.body.message_no,
                UserNo: req.body.user_no
            }
            let requiredFields = [
                "MessageNo",
                "UserNo"
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
        let result;
        let data;
        if (fileType !== "PDF") {
            data = {
                MessageNo: req.body.message_no,
                UserNo: req.body.user_no,
                FilePath: folderName,
                FileName: fileNameLocal,
                MenuFileName: '画像' + commonUtil.dateToyyyyMMddHHmm(dateNow),
                notLog: true,
                tokenData: req.body.tokenData
            }
            let requiredFields = [
                "MessageNo",
                "UserNo"
            ]
            let checkRequired = validation.checkRequiredFields(data, requiredFields);
            if (checkRequired.required) {
                return res.json({
                    code: ResCode.REQUIRED,
                    message: 'Parameter(s) is required!',
                    data: checkRequired
                });
            }

            result = await service.createFile(data);
        }
        else {
            data = {
                UserNo: req.body.user_no,
                MessageNo: req.body.message_no,
                ResultPath: folderName + '/' + fileNameLocal,
                TantoName: req.body.tanto_name,
                notLog: true,
                tokenData: req.body.tokenData
            }
            let requiredFields = [
                "MessageNo",
                "UserNo"
            ]
            let checkRequired = validation.checkRequiredFields(data, requiredFields);
            if (checkRequired.required) {
                return res.json({
                    code: ResCode.REQUIRED,
                    message: 'Parameter(s) is required!',
                    data: checkRequired
                });
            }

            result = await resultShokenBunsekiService.createNew(data);
        }
        
        let endTime = new Date();
        let logData = [
            { key: "Start time", content: dateNow },
            { key: "End time", content: endTime },
            { key: "File", content: "MessageController.js" },
            { key: "Function", content: "messageImageUpload" },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return res.json(result);
    });
}

async function getMessageImg(request, response) {
    let startTime = new Date();
    let requiredFields = [
        'file_id'
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
            { key: "File", content: "MessageFileController.js" },
            { key: "Function", content: "getMessageImg" },
            { key: "Param", content: JSON.stringify(request.query) }
        ]
        logService.accessLog(logData);

        return response.json(result);
    }

    let objFile = {
        FileID: request.query.file_id
    }

    let result = await service.getFileDetail(objFile);
    if (result.code === ResCode.SUCCESS) {
        fs.readFile(systemConfig.get('TestENV.messagePath') + '/' + result.data.FilePath + '/' + result.data.FileName, function (err, data) {
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
                { key: "File", content: "MessageFileController.js" },
                { key: "Function", content: "getMessageImg" },
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
            { key: "Function", content: "getMessageImg" },
            { key: "Param", content: JSON.stringify(objFile) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return response.json(result);
    }
}
//#endregion

module.exports = {
    uploadFile,
    getMessageImg
}