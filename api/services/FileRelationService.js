'use strict';
const model = require('../models/T_FileRelation');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getListFileRelation(objSearch) {
    let requiredFields = [
        'UserNo'
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

    objSearch.DelF = 0;
    let data = await model.getListFileRelation(objSearch);
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

//#region only kanri -------------------------------------------------------------------------------------
async function createFile(data) {
    // Insert data
    let result = await model.createFile(data);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message: 'Create successed!',
            data: result.id
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot create information!'
        }
    }
}

async function kanriDeleteFileRelation(objSearch) {
    let requiredFields = [
        'UserNo',
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

    let result = await model.kanriDeleteFileRelation(objSearch);
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
    getListFileRelation,
    createFile,
    kanriDeleteFileRelation
}