'use strict';
const model = require('../models/V_Hosho');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getListHosho(objSearch) {
    objSearch.DelF = 0;
    let data = await model.getListHosho(objSearch);
    var result;
    if (data) {
        result = {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: data
        }
    } else {
        result = {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
    return result;
}

async function getListTokuyakuHosho(objSearch) {
    let requiredFields = [
        'COMPANYCD',
        'PRODUCTCD',
        'CATEGORYCD'
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

    objSearch.DelF = 0;
    let data = await model.getListTokuyakuHosho(objSearch);
    var result;
    if (data) {
        result = {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: data
        }
    } else {
        result = {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
    return result;
}

async function getListKeiyakuHosho(objSearch) {
    let requiredFields = [
        'HoshoCategoryF',
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

    objSearch.DispF = 0;
    let data = await model.getListKeiyakuHosho(objSearch);
    var result;
    if (data) {
        result = {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: data
        }
    } else {
        result = {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
    return result;
}

module.exports = {
    getListHosho,
    getListTokuyakuHosho,
    getListKeiyakuHosho
}