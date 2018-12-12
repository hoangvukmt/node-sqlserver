'use strict';
const model = require('../models/T_KeiyakuTokuyaku');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getListKeiyakuTokuyaku(objSearch) {
    let requiredFields = [
        'KeiyakuNo'
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

    let data = await model.getListKeiyakuTokuyaku(objSearch);
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

async function getDetailKeiyakuTokuyaku(objSearch) {
    let requiredFields = [
        'KeiyakuTokuyakuNo'
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

    let result = await model.getDetailKeiyakuTokuyaku(objSearch);
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

async function createKeiyakuTokuyaku(data) {
    let requiredFields = [
        "KeiyakuNo",
        "TokuyakuName",
        "SeqNo"
    ]
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let result = await model.createKeiyakuTokuyaku(data);
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

async function updateKeiyakuTokuyaku(data) {
    let requiredFields = [
        "KeiyakuTokuyakuNo",
        "KeiyakuNo",
        "TokuyakuName",
        "SeqNo"
    ]
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let result = await model.updateKeiyakuTokuyaku(data);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message: 'Update successed!',
            data: result.id
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot update information!'
        }
    }
}

module.exports = {
    getListKeiyakuTokuyaku,
    getDetailKeiyakuTokuyaku,
    createKeiyakuTokuyaku,
    updateKeiyakuTokuyaku
}