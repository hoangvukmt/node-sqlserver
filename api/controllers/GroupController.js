const multer  = require('multer');
const fs = require('fs');
const systemConfig = require('config');

const uploadService = require('../services/UploadService');
const groupService = require('../services/GroupService');
const fileService = require('../services/FileService');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');
const commonUtil = require('../util/common');
const logService = require('../services/LogService');
const keiyakuService = require('../services/KeiyakuService');
const moveFile = require('move-file');
const areaService = require('../services/AreaService');

async function uploadFile(req, res, tokenData) {
    var dateNow = new Date();
    var fileNameLocal;

    var storage = multer.diskStorage({
        destination: async (request, file, cb) => {
            let data = {
                GroupID: request.body.group_id
            }

            let filePath;
            if (validation.isEmptyObject(data.GroupID) || data.GroupID === "0") {
                if (!fs.existsSync(systemConfig.get('TestENV.tempUpload'))){
                    fs.mkdirSync(systemConfig.get('TestENV.tempUpload'));
                }
                filePath = systemConfig.get('TestENV.tempUpload');
            }
            else {
                let groupDetail = await groupService.getGroupDetail(data);
                if (groupDetail.code !== ResCode.SUCCESS) {
                    return res.json(groupDetail);
                }
                else {
                    filePath = systemConfig.get('TestENV.uploadPath') + '/' + groupDetail.data.FilePath + '/' + data.GroupID;
                }
            }
            
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
                GroupID: req.body.group_id
            }
            if (validation.isEmptyObject(data.GroupID) || data.GroupID === "0") {
                cb(null, true);
            }
            else {
                let validateFile = await fileService.validate(data);
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
        let data = {
            GroupID: req.body.group_id,
            KeiyakuNo: req.body.keiyaku_no,
            FamilyNo: req.body.family_no,
            hihoFamilyNo: req.body.hiho_family_no,
            tokenData: tokenData
        }

        let result;
        if (validation.isEmptyObject(data.GroupID) || data.GroupID === "0") {
            if (!validation.isEmptyObject(data.KeiyakuNo)) {
                let keiyaku = await keiyakuService.getDetailKeiyaku({KeiyakuNo: data.KeiyakuNo});
                if (keiyaku) {
                    let fileNameDb = '画像' + commonUtil.dateToyyyyMMddHHmm(dateNow);
                    let groupId = keiyaku.data.keiyakuField.GroupID;
                    if (groupId.toString() === '0') {
                        // inser data to T_Group
                        let folderName = data.tokenData.user_no + "/" + data.hihoFamilyNo;
                        let groupInfo = {
                            FamilyNo: data.FamilyNo,
                            hihoFamilyNo: data.hihoFamilyNo,
                            FilePath: folderName,
                            FileName: fileNameDb,
                            tokenData: data.tokenData
                        }
                        result = await groupService.createGroup(groupInfo);
                        
                        if (result.code === ResCode.SUCCESS) {
                            // insert data to T_File
                            let fileInfo = {
                                GroupID: result.data,
                                FileID: 1,
                                ImgFileName: fileNameLocal,
                                JsonFileName: null,
                                MenuFileName: fileNameDb + '_1',
                                DelF: 0,
                                tokenData: data.tokenData
                            }
                            let fileResult = await fileService.createFile(fileInfo);
                            if (fileResult.code === ResCode.SUCCESS) {
                                // Move file from temp to file path
                                if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.hihoFamilyNo + "/" + result.data)){
                                    fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.hihoFamilyNo + "/" + result.data);
                                }
                                (async () => {
                                    await moveFile(systemConfig.get('TestENV.tempUpload') + '/' + fileNameLocal, systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.hihoFamilyNo + "/" + result.data + "/" + fileNameLocal);
                                })();
                                // Update GroupID to T_Keiyaku
                                let keiyakuUpdate = {
                                    KeiyakuNo: data.KeiyakuNo,
                                    GroupID: result.data,
                                    tokenData: data.tokenData
                                }
                                await keiyakuService.updateGroupId(keiyakuUpdate);
                                // Create edit info
                                if (typeof req.body.edit_info !== "undefined") {
                                    let objArea = {
                                        GroupID: result.data,
                                        FileID: 1,
                                        UpLeftX: req.body.edit_info.upLeft_x,
                                        UpLeftY: req.body.edit_info.upLeft_y,
                                        UpRightX: req.body.edit_info.upRight_x,
                                        UpRightY: req.body.edit_info.upRight_y,
                                        BottomLeftX: req.body.edit_info.bottomLeft_x,
                                        BottomLeftY: req.body.edit_info.bottomLeft_y,
                                        BottomRightX: req.body.edit_info.bottomRight_x,
                                        BottomRightY: req.body.edit_info.bottomRight_y,
                                        Rotate: req.body.edit_info.rotate,
                                        tokenData: data.tokenData
                                    }
                                    await areaService.createArea(objArea);
                                }
                            }
                        }
                    }
                }
            }
            else {
                result = {
                    fileName: fileNameLocal
                }
            }
        }
        else {
            let dataValidate = {
                GroupID: req.body.group_id
            }
            let validateFile = await fileService.validate(dataValidate);
            if (validateFile.code !== ResCode.SUCCESS) {
                return res.json(validateFile);
            }
            let objSearch = {
                GroupID: req.body.group_id
            }
            let lsFile = await fileService.getAllFile(objSearch);
            let lastId = 0;
            if (lsFile) {
                lastId = lsFile.data.length;
            }
            let fileNameDb;
            let groupDetail = await groupService.getGroupDetail({GroupID: req.body.group_id});
            if (groupDetail.code === ResCode.SUCCESS) {
                fileNameDb = groupDetail.data.FileName;
            }

            var fileInfo = {
                GroupID: data.GroupID,
                FileID: lastId + 1,
                ImgFileName: fileNameLocal,
                JsonFileName: null,
                MenuFileName: fileNameDb + '_' + (lastId + 1),
                DelF: 0,
                tokenData: tokenData
            }
            result = await fileService.createFile(fileInfo);
            // Create edit info
            if (typeof req.body.edit_info !== "undefined") {
                let objArea = {
                    GroupID: data.GroupID,
                    FileID: lastId + 1,
                    UpLeftX: req.body.edit_info.upLeft_x,
                    UpLeftY: req.body.edit_info.upLeft_y,
                    UpRightX: req.body.edit_info.upRight_x,
                    UpRightY: req.body.edit_info.upRight_y,
                    BottomLeftX: req.body.edit_info.bottomLeft_x,
                    BottomLeftY: req.body.edit_info.bottomLeft_y,
                    BottomRightX: req.body.edit_info.bottomRight_x,
                    BottomRightY: req.body.edit_info.bottomRight_y,
                    Rotate: req.body.edit_info.rotate,
                    tokenData: tokenData
                }
                await areaService.createArea(objArea);
            }
        }

        let endTime = new Date();
        let logData = [
            { key: "Start time", content: dateNow },
            { key: "End time", content: endTime },
            { key: "File", content: "GroupController.js" },
            { key: "Function", content: "uploadFile" },
            { key: "Param", content: JSON.stringify({}) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return res.json(result);
    });
}

async function editImage(req, res, tokenData) {
    let startTime = new Date();
    var fileNameLocal;

    var storage = multer.diskStorage({
        destination: async (request, file, cb) => {
            let data = {
                Type: request.body.type,
                FileName: request.body.file_name,
                GroupID: request.body.group_id,
                FileID: request.body.file_id
            }
            if (data.Type === 'TEMP') {
                fileNameLocal = request.body.file_name;
                await fs.rename(systemConfig.get('TestENV.tempUpload') + '/' + data.FileName, systemConfig.get('TestENV.tempUpload') + '/' + data.FileName + '_bak_' + commonUtil.dateToyyyyMMddHHmmssii(startTime), async function(err) {
                    if ( err ) {
                        let result = {
                            code: ResCode.SERVER_ERROR,
                            message: 'Server error! Cannot update information!'
                        }

                        let endTime = new Date();
                        let logData = [
                            { key: "Start time", content: startTime },
                            { key: "End time", content: endTime },
                            { key: "File", content: "GroupController.js" },
                            { key: "Function", content: "editImage" },
                            { key: "Param", content: JSON.stringify(data) },
                            { key: "Result", content: JSON.stringify(result) }
                        ]
                        await logService.accessLog(logData);

                        return res.json(result);
                    }
                    else {
                        cb(null, systemConfig.get('TestENV.tempUpload'));
                    }
                });
            }
            else {
                let objFile = {
                    GroupID: request.body.group_id,
                    FileID: request.body.file_id
                }
                let resultFile = await fileService.getFileDetail(objFile);
                if (resultFile.code === ResCode.SUCCESS) {
                    let fileData = resultFile.data;
                    fileNameLocal = fileData.ImgFileName;
                    await fs.rename(systemConfig.get('TestENV.uploadPath') + '/' + fileData.FilePath + '/' + fileData.GroupID + '/' + fileData.ImgFileName, systemConfig.get('TestENV.uploadPath') + '/' + fileData.FilePath + '/' + fileData.GroupID + '/' + fileData.ImgFileName + '_bak_' + commonUtil.dateToyyyyMMddHHmmssii(startTime), async function(err) {
                        if ( err ) {
                            console.log(err);
                            let result = {
                                code: ResCode.SERVER_ERROR,
                                message: 'Server error! Cannot update information!'
                            }

                            let endTime = new Date();
                            let logData = [
                                { key: "Start time", content: startTime },
                                { key: "End time", content: endTime },
                                { key: "File", content: "GroupController.js" },
                                { key: "Function", content: "editImage" },
                                { key: "Param", content: JSON.stringify(data) },
                                { key: "Result", content: JSON.stringify(result) }
                            ]
                            await logService.accessLog(logData);

                            return res.json(result);
                        }
                        else {
                            cb(null, systemConfig.get('TestENV.uploadPath') + '/' + fileData.FilePath + '/' + fileData.GroupID);
                        }
                    });
                }
                else {
                    let endTime = new Date();
                    let logData = [
                        { key: "Start time", content: startTime },
                        { key: "End time", content: endTime },
                        { key: "File", content: "GroupController.js" },
                        { key: "Function", content: "editImage" },
                        { key: "Param", content: JSON.stringify(data) },
                        { key: "Result", content: JSON.stringify(resultFile) }
                    ]
                    await logService.accessLog(logData);

                    return res.json(resultFile);
                }
            }
        },
        filename: async (request, file, cb) => {
            cb(null, fileNameLocal);
        }
    });

    let upload = multer({
        storage: storage,
        fileFilter: async function (req, file, cb) {
            cb(null, true);
        }
    }).single('file_img');

    upload(req, res, async function(err) {
        let result = {
            code: ResCode.SUCCESS,
            message: ''
        }

        let endTime = new Date();
        let logData = [
            { key: "Start time", content: startTime },
            { key: "End time", content: endTime },
            { key: "File", content: "GroupController.js" },
            { key: "Function", content: "editImage" },
            { key: "Param", content: JSON.stringify({}) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return res.json(result);
    });
}

/*
async function uploadFile(req, res, tokenData) {
    var dateNow = new Date();
    var validateFile;
    var folderName;
    var fileNameLocal;

    var storage = multer.diskStorage({
        destination: async (request, file, cb) => {
            let data = {
                GroupID: request.body.group_id,
                FamilyNo: request.body.family_no,
                hihoFamilyNo: request.body.hiho_family_no
            }
            if (validation.isEmptyObject(data.GroupID) || data.GroupID === "-1" || data.GroupID === "0") {
                let validateGroup = await groupService.validate(data);
                if (validateGroup.code !== ResCode.SUCCESS) {
                    return res.json(validateGroup);
                }
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
                GroupID: req.body.group_id,
                FamilyNo: req.body.family_no,
                hihoFamilyNo: req.body.hiho_family_no
            }
            if (validation.isEmptyObject(data.GroupID) || data.GroupID === "-1" || data.GroupID === "0") {
                let validateGroup = await groupService.validate(data);
                if (validateGroup.code !== ResCode.SUCCESS) {
                    cb(null, false);
                }
                else {
                    cb(null, true);
                }
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
            GroupID: req.body.group_id,
            FamilyNo: req.body.family_no,
            hihoFamilyNo: req.body.hiho_family_no
        }
        let lastId = 0;
        if (validation.isEmptyObject(req.body.group_id) || req.body.group_id === "-1" || req.body.group_id === "0") {
            let validateGroup = await groupService.validate(dataValidate);
            if (validateGroup.code !== ResCode.SUCCESS) {
                return res.json(validateGroup);
            }
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
            FamilyNo: req.body.family_no,
            hihoFamilyNo: req.body.hiho_family_no,
            FileID: lastId,
            KeiyakuNo: req.body.keiyaku_no,
            tokenData: tokenData
        }
        var fileNameDb = '画像' + commonUtil.dateToyyyyMMddHHmm(dateNow);
        // create new group
        if (validation.isEmptyObject(data.GroupID) || data.GroupID === "-1" || data.GroupID === "0") {
            // inser data to T_Group
            let groupInfo = {
                FamilyNo: data.FamilyNo,
                hihoFamilyNo: data.hihoFamilyNo,
                FileID: lastId,
                FilePath: folderName,
                FileName: fileNameDb,
                KeiyakuNo: data.KeiyakuNo,
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
                tokenData: tokenData
            }
            result = await fileService.createFile(fileInfo);
        }
        let endTime = new Date();
        let logData = [
            { key: "Start time", content: dateNow },
            { key: "End time", content: endTime },
            { key: "File", content: "GroupController.js" },
            { key: "Function", content: "uploadFile" },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return res.json(result);
    });
}
*/
/*
async function editImage(request, response) {
    let startTime = new Date();
    let result;
    let data = {
        Type: request.body.type,
        FileName: request.body.file_name,
        GroupID: request.body.group_id,
        FileID: request.body.file_id,
        FileBase64: request.body.file_base_64,
        tokenData: request.body.tokenData
    }

    if (data.Type === 'TEMP') {
        fs.rename(systemConfig.get('TestENV.tempUpload') + '/' + data.FileName, systemConfig.get('TestENV.tempUpload') + '/' + data.FileName + '_bak_' + commonUtil.dateToyyyyMMddHHmmssii(startTime), async function(err) {
            if ( err ) {
                result = {
                    code: ResCode.SERVER_ERROR,
                    message: 'Server error! Cannot update information!'
                }
            }
            else {
                var resultUpload = commonUtil.writeBase64File(data.FileBase64, systemConfig.get('TestENV.tempUpload'), data.FileName);
                if (resultUpload.ok){
                    result = {
                        code: ResCode.SUCCESS,
                        message: ''
                    }
                }
                else {
                    result = {
                        code: ResCode.SERVER_ERROR,
                        message: resultUpload.msg
                    }
                }
            }

            let endTime = new Date();
            let logData = [
                { key: "Start time", content: startTime },
                { key: "End time", content: endTime },
                { key: "File", content: "GroupController.js" },
                { key: "Function", content: "editImage" },
                { key: "Param", content: JSON.stringify(data) },
                { key: "Result", content: JSON.stringify(result) }
            ]
            await logService.accessLog(logData);

            return response.json(result);
        });
    }
    else {
        let objFile = {
            GroupID: request.body.group_id,
            FileID: request.body.file_id
        }
        result = await fileService.getFileDetail(objFile);
        if (result.code === ResCode.SUCCESS) {
            let fileData = result.data;
            fs.rename(systemConfig.get('TestENV.uploadPath') + '/' + fileData.FilePath + '/' + fileData.GroupID + '/' + fileData.ImgFileName, systemConfig.get('TestENV.uploadPath') + '/' + fileData.FilePath + '/' + fileData.GroupID + '/' + fileData.ImgFileName + '_bak_' + commonUtil.dateToyyyyMMddHHmmssii(startTime), async function(err) {
                if ( err ) {
                    result = {
                        code: ResCode.SERVER_ERROR,
                        message: 'Server error! Cannot update information!'
                    }
                }
                else {
                    var resultUpload = commonUtil.writeBase64File(data.FileBase64, systemConfig.get('TestENV.uploadPath') + '/' + fileData.FilePath + '/' + fileData.GroupID, fileData.ImgFileName);
                    if (resultUpload.ok){
                        result = {
                            code: ResCode.SUCCESS,
                            message: ''
                        }
                    }
                    else {
                        result = {
                            code: ResCode.SERVER_ERROR,
                            message: resultUpload.msg
                        }
                    }
                }
    
                let endTime = new Date();
                let logData = [
                    { key: "Start time", content: startTime },
                    { key: "End time", content: endTime },
                    { key: "File", content: "GroupController.js" },
                    { key: "Function", content: "editImage" },
                    { key: "Param", content: JSON.stringify(data) },
                    { key: "Result", content: JSON.stringify(result) }
                ]
                await logService.accessLog(logData);
    
                return response.json(result);
            });
        }
        else {
            let endTime = new Date();
            let logData = [
                { key: "Start time", content: startTime },
                { key: "End time", content: endTime },
                { key: "File", content: "GroupController.js" },
                { key: "Function", content: "editImage" },
                { key: "Param", content: JSON.stringify(data) },
                { key: "Result", content: JSON.stringify(result) }
            ]
            await logService.accessLog(logData);
            return response.json(result);
        }
    }
}
*/

async function updateGroup(request, response) {
    let startTime = new Date();
    let data = {
        GroupID: request.body.group_id,
        AutoF: request.body.auto_f,
        Status: request.body.status,
        tokenData: request.body.tokenData
    }
    let result = await groupService.updateGroup(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "GroupController.js" },
        { key: "Function", content: "updateGroup" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

module.exports = {
    uploadFile,
    editImage,
    updateGroup
}