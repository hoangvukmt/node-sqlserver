'use strict';
const model = require('../models/V_Agent');
const ResCode = require('../util/validation').RESPONSE_CODE;

async function getListAgent(objSearch) {
    let data = await model.searchData(objSearch);
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
    getListAgent
}