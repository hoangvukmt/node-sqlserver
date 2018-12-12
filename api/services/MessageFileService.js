'use strict';
const model = require('../models/T_MessageFile');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

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

async function getFileDetail(objSearch) {
    let requiredFields = [
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
//#endregion

module.exports = {
    createFile,
    getFileDetail
}