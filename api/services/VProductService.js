'use strict';
const model = require('../models/V_Product');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getListProduct(objSearch) {
    let requiredFields = [
        'COMPANYCD'
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
    let data = await model.getListProduct(objSearch);
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
    getListProduct
}