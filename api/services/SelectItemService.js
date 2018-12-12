'use strict';
const model = require('../models/M_SelectItem');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getListSelectItem(objSearch) {
    let requiredFields = [
        'selType'
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

    let data = await model.getListSelectItem(objSearch);
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

module.exports = {
    getListSelectItem
}