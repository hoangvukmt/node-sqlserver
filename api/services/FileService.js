'use strict';
const model = require('../models/T_File');
const groupModel = require('../models/T_Group');
const baseModel = require('../base/BaseModel');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');
const systemConfig = require('config');
const commonUtil = require('../util/common');

async function getListFile(objSearch) {
    let requiredFields = [
        'GroupID'
    ]
    let checkRequired = validation.checkRequiredFields(objSearch, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let data = await model.getListFile(objSearch);
    if (data) {
        /*
        for (var i = 0; i < data.length; i++){
            var filePath = systemConfig.get('TestENV.uploadPath') + "/" + data[i].FilePath + "/" + data[i].ImgFileName;
            data[i].fileBase64 = commonUtil.encodeBase64Image(filePath);
        }
        */
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: data
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}

async function getAllFile(objSearch) {
    let data = await model.getAllFile(objSearch);
    if (data) {
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: data
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}

async function getFileDetail(objSearch) {
    let requiredFields = [
        'GroupID',
        'FileID'
    ]
    let checkRequired = validation.checkRequiredFields(objSearch, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let result = await model.getFileDetail(objSearch);
    if (result) {
        /*
        result.FilePath = systemConfig.get('TestENV.uploadPath') + "/" + result.FilePath + "/" + result.ImgFileName;
        result.fileBase64 = commonUtil.encodeBase64Image(result.FilePath);
        */
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: result
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}

async function createFile(data) {
    let validateResult = await validate(data);
    if (validateResult.code !== ResCode.SUCCESS){
        return validateResult;
    }
    
    // Insert data
    let result = await model.createFile(data);
    if (result) {
        let logContent = {
            UserNo: data.tokenData.user_no,
            ActionContent: baseModel.logContent.AddHokenImage,
            ActionCode: 16
        }
        await baseModel.writeLog(logContent);

        return {
            code: ResCode.SUCCESS,
            message: 'Create successed!'
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot create information!'
        }
    }
}

async function deleteFile(objSearch) {
    let requiredFields = [
        'GroupID',
        'FileID'
    ]
    let checkRequired = validation.checkRequiredFields(objSearch, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let result = await model.deleteFile(objSearch);
    if(result) {
        return {
            code: ResCode.SUCCESS,
            message: 'Delete successed!'
        };
    }else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot delete information!'
        }
    }
}

async function getFilePdf(objSearch) {
    let requiredFields = [
        'FileName'
    ]
    let checkRequired = validation.checkRequiredFields(objSearch, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }
    
    let filePath = systemConfig.get('TestENV.pdfPath') + "/" + objSearch.FileName;
    let fileBase64 = commonUtil.encodeBase64Image(filePath);
    return {
        code: ResCode.SUCCESS,
        message:'Get successed!',
        data: fileBase64
    }
}

async function getListImage(objData) {
    let requiredFields = [
        'KeiyakuNo',
        'UserNo'
    ]
    let checkRequired = validation.checkRequiredFields(objData, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let data = await model.getListImage(objData);
    if (data) {
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: data
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}

async function validate (data) {
    // Check required param
    let requiredFields = [
        'GroupID'
    ]
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        return {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
    }

    // Check group exist
    let groupInfo = await groupModel.getInfoGroup(data);
    if (!groupInfo){
        return {
            code: ResCode.REQUIRED,
            message: 'GroupID do not exist!'
        };
    }

    return {
        code: ResCode.SUCCESS,
        message: '',
        data: groupInfo
    }
}

//#region only kanri -------------------------------------------------------------------------------------
async function kanriDeleteFile(objSearch) {
    let requiredFields = [
        'GroupID',
        'FileID'
    ]
    let checkRequired = validation.checkRequiredFields(objSearch, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let result = await model.kanriDeleteFile(objSearch);
    if(result) {
        return {
            code: ResCode.SUCCESS,
            message: 'Delete successed!'
        };
    }else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot delete information!'
        }
    }
}
//#endregion

module.exports = {
    getAllFile,
    createFile,
    getListFile,
    getFileDetail,
    deleteFile,
    getFilePdf,
    validate,
    getListImage,
    kanriDeleteFile
}