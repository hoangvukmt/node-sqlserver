'use strict';
const ResCode = require('../util/validation').RESPONSE_CODE;
const model = require('../models/T_HaishinLog');
const validation = require('../util/validation');
const messageModel = require('../models/T_Message');

//#region only kanri -------------------------------------------------------------------------------------
async function searchHaishinLog(objSearch) {
    let result = await model.searchHaishinLog(objSearch);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: result.data,
            totalRecord: result.totalRecord
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
    return result;
}

async function getHaishinLogDetail (objSearch) {
    let requiredFields = [
        'HaishinID'
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

    let result = await model.getHaishinLogDetail (objSearch);
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
    return result;
}

async function createHaishinlog (data) {
    let requiredFields = [        
        'TargetF',
        'KanyuShiteiF',
        'KikanF',
        'TargetCount',
        'MessageTitle',
        'Message',
        'TantoName'
    ];
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let result = await model.createHaishinlog (data);
    if (result) {
        if (data.lsSend.length > 0) {
            let strDone = '';
            for (let i = 0; i < data.lsSend.length; i++) {
                let item = data.lsSend[i];
                if (!(strDone.indexOf(',' + item.UserNo + ',') >= 0)) {
                    strDone += ',' + item.UserNo + ',';

                    let objMessage = {
                        ParentMessageNo: 0,
                        UserNo: item.UserNo,
                        IconNumber: 0,
                        MessageType: 0,
                        MessageTitle: data.MessageTitle,
                        Message: data.Message,
                        TantoName: data.TantoName,
                        notLog: true
                    };
    
                    await messageModel.createMessage(objMessage);
                }
            }
        }
        return {
            code: ResCode.SUCCESS,
            message: 'Create successed!',
            data: result.id
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
    searchHaishinLog,
    getHaishinLogDetail,
    createHaishinlog
}