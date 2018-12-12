//check logic in services before call to model
'use strict';
const RiyoModel = require('../models/T_Riyo');
const UserModel = require('../models/T_User');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function asyncGetUserNobyLoginId(loginId) {
    let userNo = await UserModel.asyncGetUserbyLoginId(loginId);
    if(userNo) {
        return userNo.UserNo;
    }
    return null;
}

async function createRiyo(userRiyo) {
    let riyo = userRiyo;
    riyo.UserNo = await asyncGetUserNobyLoginId(userRiyo.LoginId);
    if(!riyo.UserNo) return false;
    let result = await RiyoModel.asyncCreateRiyo(riyo);
    if ( result.rowsAffected !== null) {
        return true;
    }
    return false;
}

//#region only kanri -------------------------------------------------------------------------------------
async function searchRiyo(objSearch) {
    let requiredFields = [
        'UserNo'
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
    let result = await RiyoModel.searchRiyo(objSearch);
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
}
//#endregion

module.exports = {
    createRiyo,
    searchRiyo
}