'use strict';
const model = require('../models/T_KeiyakuHosho');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getListKeiyakuHosho(objSearch) {
    let requiredFields = [
        'KeiyakuNo',
        'KeiyakuTokuyakuNo'
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

    let data = await model.getListKeiyakuHosho(objSearch, [{ key: "SeqNo", type: "ASC" }]);
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

async function getDetailKeiyakuHosho(objSearch) {
    let requiredFields = [
        'KeiyakuHoshoNo'
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

    let result = await model.getDetailKeiyakuHosho(objSearch);
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

async function createKeiyakuHosho(data) {
    let requiredFields = [
        "KeiyakuNo",
        "KeiyakuTokuyakuNo",
        "HoshoNo",
        "HoshoName",
        "ColumnVal",
        "TypeF",
        "Size",
        "SelType",
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

    let result = await model.createKeiyakuHosho(data);
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

async function updateKeiyakuHosho(data) {
    let requiredFields = [
        "KeiyakuHoshoNo",
        "KeiyakuNo",
        "KeiyakuTokuyakuNo",
        "HoshoNo",
        "HoshoName",
        "ColumnVal",
        "TypeF",
        "Size",
        "SelType",
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

    let result = await model.updateKeiyakuHosho(data);
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
    getListKeiyakuHosho,
    getDetailKeiyakuHosho,
    createKeiyakuHosho,
    updateKeiyakuHosho
}