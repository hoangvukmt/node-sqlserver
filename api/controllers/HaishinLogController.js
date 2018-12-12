const multer  = require('multer');
const fs = require('fs');
const systemConfig = require('config');

const service = require('../services/HaishinLogServices');
const fileService = require('../services/FileService');
const groupService = require('../services/GroupService');
const logService = require('../services/LogService');
const commonUtil = require('../util/common');
const validation = require('../util/validation');
const ResCode = require('../util/validation').RESPONSE_CODE;

//#region only kanri -------------------------------------------------------------------------------------
async function searchHaishinLog(request, response) {
    let startTime = new Date();
    let objSearch = {
        FromDate: request.body.from_date,
        ToDate: request.body.to_date,        
        Sort: (typeof request.body.sort === "undefined" || request.body.sort === null ? [] : request.body.sort),
        Filter: (typeof request.body.filter === "undefined" || request.body.filter === null ? [] : request.body.filter),
        Page: (typeof request.body.page === "undefined" || request.body.page === null ? 1 : request.body.page),
        PageSize: (typeof request.body.pageSize === "undefined" || request.body.pageSize === null ? 10 : request.body.pageSize)
    };
    let data = await service.searchHaishinLog(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "HaishinLogController.js" },
        { key: "Function", content: "searchHaishinLog" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getHaishinLogDetail (request, response) {
    let startTime = new Date();
    let objSearch = {
        HaishinID: request.body.haishin_id        
    };
    let data = await service.getHaishinLogDetail (objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "HaishinLogController.js" },
        { key: "Function", content: "getHaishinLogDetail" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function haishinLogUpload(req, res, tokenData) {
    var dateNow = new Date();
    var validateFile;
    var folderName;
    var fileNameLocal;

    var storage = multer.diskStorage({
        destination: async (request, file, cb) => {
            let data = {
                GroupID: request.body.group_id
            }
            if (validation.isEmptyObject(data.GroupID) || data.GroupID === "0") {
                folderName = commonUtil.dateToyyyyMMdd(dateNow);
            }
            else {
                validateFile = await fileService.validate(data);
                if (validateFile.code !== ResCode.SUCCESS) {
                    return res.json(validateFile);
                }
                folderName = validateFile.data.FilePath;
            }
            if (!fs.existsSync(systemConfig.get('TestENV.uploadPath'))){
                fs.mkdirSync(systemConfig.get('TestENV.uploadPath'));
            }
            if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + '/' + folderName)){
                fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + '/' + folderName);
            }
            var filePath = systemConfig.get('TestENV.uploadPath') + '/' + folderName;
            cb(null, filePath);
        },
        filename: async (request, file, cb) => {
            let lastId = 0;
            if (validation.isEmptyObject(request.body.group_id) || request.body.group_id === "-1" || request.body.group_id === "0") {
                lastId = 1;
            }
            else {
                let objSearch = {
                    GroupID: request.body.group_id
                }
                let lsFile = await fileService.getAllFile(objSearch);
                if (lsFile) {
                    lastId = lsFile.data.length + 1;
                }
            }
            let data = {
                FileID: lastId
            }
            var fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.'));
            fileNameLocal = '画像' + commonUtil.dateToyyyyMMddHHmmssii(dateNow) + '_' + data.FileID + fileExtension;
            cb(null, fileNameLocal);
        }
    });

    let upload = multer({
        storage: storage,
        fileFilter: async function (req, file, cb) {
            let data = {
                GroupID: req.body.group_id
            }
            if (validation.isEmptyObject(data.GroupID) || data.GroupID === "0") {
                cb(null, true);
            }
            else {
                validateFile = await fileService.validate(data);
                if (validateFile.code !== ResCode.SUCCESS) {
                    cb(null, false);
                }
                else {
                    cb(null, true);
                }
            }
        }
    }).single('file_img');

    upload(req, res, async function(err) {
        let dataValidate = {
            GroupID: req.body.group_id
        }
        let lastId = 0;
        if (validation.isEmptyObject(req.body.group_id) || req.body.group_id === "0") {
            lastId = 1;
        }
        else {
            validateFile = await fileService.validate(dataValidate);
            if (validateFile.code !== ResCode.SUCCESS) {
                return res.json(validateFile);
            }
            let objSearch = {
                GroupID: req.body.group_id
            }
            let lsFile = await fileService.getAllFile(objSearch);
            if (lsFile) {
                lastId = lsFile.data.length + 1;
            }
        }

        let result;
        let data = {
            GroupID: req.body.group_id,
            FileID: lastId,
            tokenData: tokenData
        }
        var fileNameDb = '画像' + commonUtil.dateToyyyyMMddHHmm(dateNow);
        // create new group
        if (validation.isEmptyObject(data.GroupID) || data.GroupID === "0") {
            // inser data to T_Group
            let groupInfo = {
                FileID: lastId,
                FilePath: folderName,
                FileName: fileNameDb,
                notLog: true,
                tokenData: tokenData
            }
            result = await groupService.createGroup(groupInfo);
            if (result.code === ResCode.SUCCESS) {
                // insert data to T_File
                var fileInfo = {
                    GroupID: result.data,
                    FileID: Number(lastId),
                    ImgFileName: fileNameLocal,
                    JsonFileName: null,
                    MenuFileName: fileNameDb + '_' + lastId,
                    DelF: 0,
                    notLog: true,
                    tokenData: tokenData
                }
                fileService.createFile(fileInfo);
            }
        }
        else {
            var fileInfo = {
                GroupID: data.GroupID,
                FileID: lastId,
                ImgFileName: fileNameLocal,
                JsonFileName: null,
                MenuFileName: fileNameDb + '_' + lastId,
                DelF: 0,
                notLog: true,
                tokenData: tokenData
            }
            result = await fileService.createFile(fileInfo);
        }
        let endTime = new Date();
        let logData = [
            { key: "Start time", content: dateNow },
            { key: "End time", content: endTime },
            { key: "File", content: "HaishinLogController.js" },
            { key: "Function", content: "haishinLogUpload" },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return res.json(result);
    });
}

async function createHaishinlog (request, response) {
    let startTime = new Date();
    let data = {
        TargetF: request.body.target_f,
        TargetSex: request.body.target_sex,
        MarriageF: request.body.marriage_f,
        HasChildF: request.body.haschild_f,
        TargetAge: request.body.target_age,
        KanyuShiteiF: request.body.kanyushite_f,
        KanyuF: request.body.kanyu_f,
        KanyuHoshoCategoryF: request.body.kanyuhoshocategory_f,
        KikanF: request.body.kikan_f,
        KikanDays: request.body.kikan_days,
        TargetCount: request.body.target_count,
        MessageTitle: request.body.message_title,
        Message: request.body.message,
        GroupID: request.body.group_id,
        TantoName: request.body.tanto_name,
        lsSend: request.body.ls_send
    };
    let result = await service.createHaishinlog (data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "HaishinLogController.js" },
        { key: "Function", content: "createHaishinlog" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}
//#endregion

module.exports = {
    searchHaishinLog,
    getHaishinLogDetail,
    haishinLogUpload,
    createHaishinlog
}