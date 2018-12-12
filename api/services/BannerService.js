'use strict';
const model = require('../models/M_Banner');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');
const commonUtil = require('../util/common');
const systemConfig = require('config');

async function getListBanner(objSearch) {
    let requiredFields = [
        'DispId'
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

    let data = await model.getListBanner(objSearch);
    if (data) {
        /*
        for (var i = 0; i < data.length; i++){
            var filePath = systemConfig.get('TestENV.bannerPath') + "/" + data[i].BannerImgPath;
            data[i].fileBase64 = commonUtil.encodeBase64Image(filePath);
        }
        */
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
    getListBanner
}