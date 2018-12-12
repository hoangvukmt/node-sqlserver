const fs = require('fs');
const systemConfig = require('config');

const ResCode = require('../util/validation').RESPONSE_CODE;
const fileService = require('../services/FileService');
const logService = require('../services/LogService');
const validation = require('../util/validation');

async function getListFile(request, response) {
    let startTime = new Date();
    let objSearch = {
        GroupID: request.body.group_id,
        tokenData: request.body.tokenData
    }
    let result = await fileService.getListFile(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FileController.js" },
        { key: "Function", content: "getListFile" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function getFileDetail(request, response) {
    let startTime = new Date();
    let objFile = {
        GroupID: request.body.group_id,
        FileID: request.body.file_id,
        tokenData: request.body.tokenData
    }
    let result = await fileService.getFileDetail(objFile);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FileController.js" },
        { key: "Function", content: "getFileDetail" },
        { key: "Param", content: JSON.stringify(objFile) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function deleteFile(request, response) {
    let startTime = new Date();
    let objFile = {
        GroupID: request.body.group_id,
        FileID: request.body.file_id,
        tokenData: request.body.tokenData
    }
    let result = await fileService.deleteFile(objFile);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FileController.js" },
        { key: "Function", content: "deleteFile" },
        { key: "Param", content: JSON.stringify(objFile) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function getFilePdf(request, response) {
    let startTime = new Date();
    let requiredFields = [
        'file_name'
    ];
    let checkRequired = validation.checkRequiredFields(request.body, requiredFields);
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
            { key: "File", content: "FileController.js" },
            { key: "Function", content: "getFilePdf" },
            { key: "Param", content: JSON.stringify(request.body) }
        ]
        logService.accessLog(logData);

        return response.json(result);
    }

    fs.readFile(systemConfig.get('TestENV.pdfPath') + "/" + request.body.file_name, function (err, data) {
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
            { key: "File", content: "FileController.js" },
            { key: "Function", content: "getFilePdf" },
            { key: "Param", content: JSON.stringify(request.body) }
        ]
        logService.accessLog(logData);
        response.end(data);
    });
}

async function getFileImg(request, response) {
    let startTime = new Date();
    let requiredFields = [
        'group_id',
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
            { key: "File", content: "FileController.js" },
            { key: "Function", content: "getFileImg" },
            { key: "Param", content: JSON.stringify(request.query) }
        ]
        logService.accessLog(logData);

        return response.json(result);
    }

    let objFile = {
        GroupID: request.query.group_id,
        FileID: request.query.file_id
    }

    let result = await fileService.getFileDetail(objFile);
    if (result.code === ResCode.SUCCESS) {
        fs.readFile(systemConfig.get('TestENV.uploadPath') + '/' + result.data.FilePath + '/' + request.query.group_id + '/' + result.data.ImgFileName, function (err, data) {
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
                { key: "File", content: "FileController.js" },
                { key: "Function", content: "getFileImg" },
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

async function getFileImgTemp(request, response) {
    let startTime = new Date();
    let requiredFields = [
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
            { key: "File", content: "FileController.js" },
            { key: "Function", content: "getFileImg" },
            { key: "Param", content: JSON.stringify(request.query) }
        ]
        logService.accessLog(logData);

        return response.json(result);
    }

    fs.readFile(systemConfig.get('TestENV.tempUpload') + '/画像' + request.query.file_name, function (err, data) {
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
            { key: "File", content: "FileController.js" },
            { key: "Function", content: "getFileImgTemp" },
            { key: "Param", content: JSON.stringify(request.query) }
        ]
        logService.accessLog(logData);
        response.end(data);
    });
}

async function getListImage(request, response) {
    let startTime = new Date();
    let objData = {
        KeiyakuNo: request.body.keiyaku_no,
        UserNo: request.body.user_no,
        tokenData: request.body.tokenData
    }
    let result = await fileService.getListImage(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FileController.js" },
        { key: "Function", content: "getListFile" },
        { key: "Param", content: JSON.stringify(objData) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

//#region only kanri -------------------------------------------------------------------------------------
async function kanriDeleteFile(request, response) {
    let startTime = new Date();
    let objFile = {
        GroupID: request.body.group_id,
        FileID: request.body.file_id,
        tokenData: request.body.tokenData
    }
    let result = await fileService.kanriDeleteFile(objFile);
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

async function getImgUpload(request, response) {
    let startTime = new Date();
    let requiredFields = [
        'group_id',
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
            { key: "File", content: "FileController.js" },
            { key: "Function", content: "getImgUpload" },
            { key: "Param", content: JSON.stringify(request.query) }
        ]
        logService.accessLog(logData);

        return response.json(result);
    }

    let objFile = {
        GroupID: request.query.group_id,
        FileID: request.query.file_id
    }

    let result = await fileService.getFileDetail(objFile);
    if (result.code === ResCode.SUCCESS) {
        fs.readFile(systemConfig.get('TestENV.uploadPath') + '/' + result.data.FilePath + '/' + result.data.GroupID + '/' + result.data.ImgFileName, function (err, data) {
            if (err) {
                console.log(err);
                return response.json({
                    code: ResCode.SERVER_ERROR,
                    message:'Server error!'
                });
            };
            let endTime = new Date();
            let logData = [
                { key: "Start time", content: startTime },
                { key: "End time", content: endTime },
                { key: "File", content: "FileController.js" },
                { key: "Function", content: "getImgUpload" },
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
            { key: "Function", content: "getImgUpload" },
            { key: "Param", content: JSON.stringify(objFile) },
            { key: "Result", content: JSON.stringify(result) }
        ]
        await logService.accessLog(logData);

        return response.json(result);
    }
}
//#endregion

module.exports = {
    getListFile,
    getFileDetail,
    deleteFile,
    getFilePdf,
    getFileImg,
    getFileImgTemp,
    getListImage,
    kanriDeleteFile,
    getImgUpload
}