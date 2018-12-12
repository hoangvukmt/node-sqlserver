'use strict';
const model = require('../models/T_ResultShokenBunseki');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getListShokenBunseki(objSearch) {
    let requiredFields = [
        'UserNo',
        'MessageNo'
    ];
    let checkRequired = validation.checkRequiredFields(objSearch, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }
    //objSearch.UserNo = 1;
    let data = await model.getListShokenBunseki(objSearch);
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

async function searchShokenBunseki(objSearch) {
    let data = await model.getListShokenBunseki(objSearch);
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
async function createNew(data) {
    let requiredFields = [
        'UserNo',
        'MessageNo',
        'ResultPath'
    ]
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        return {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
    }
    
    // Insert data
    let result = await model.createNew(data);
    if (result) {
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
//#endregion

module.exports = {
    getListShokenBunseki,
    searchShokenBunseki,
    createNew
}