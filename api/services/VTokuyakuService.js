'use strict';
const model = require('../models/V_Tokuyaku');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getListTokuyaku(objSearch) {
    let data = await model.getListTokuyaku(objSearch);
    var result;
    if (data) {
        let arr = [];
        let strName = '<dcm>';
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (strName.indexOf('<dcm>' + item.NAME + '<dcm>') < 0) {
                arr.push(item);
                strName += item.NAME + '<dcm>';
            }
        }
        result = {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: arr
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
    getListTokuyaku
}