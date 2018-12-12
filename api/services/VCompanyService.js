'use strict';
const model = require('../models/V_Company');
const ResCode = require('../util/validation').RESPONSE_CODE;

async function getListCompany(objSearch) {
    let data = await model.getListCompany(objSearch);
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
    getListCompany
}