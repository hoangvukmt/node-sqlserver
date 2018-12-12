'use strict';
const model = require('../models/T_Family');
const UserModel = require('../models/T_User');
const baseModel = require('../base/BaseModel');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

const RiyoAction = require('../models/T_Riyo').T_Riyo_ActionContent;
const RiyoService = require('./RiyoService');
const keiyakuService = require('./KeiyakuService');

async function getFamilyInfo(objSearch) {
    let requiredFields = [
        'LoginId'
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

    let user = await UserModel.asyncGetUserbyLoginId(objSearch.LoginId);
    if(!user) {
        return {
            code: ResCode.NOT_EXIST,
            message: 'LoginId is not exist!'
        };
    }

    let family = await model.asyncGetFamilybyUser(user);
    if (family) {
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: family
        }
    } else {
        result = {
            code: ResCode.REQUIRED,
            message: `Cannot get Family info of ${loginId}`
        }
    }
}

async function getListFamily(objSearch) {
    let requiredFields = [
        'UserNo'
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
    let data = await model.getListFamily(objSearch);
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

async function getInfoFamily(objSearch) {
    let requiredFields = [
        'FamilyNo'
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

    let data = await model.getInfobyFamilyNo(objSearch.FamilyNo);
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

async function deleteFamily(objSearch) {
    let requiredFields = [
        'FamilyNo'
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
    
    let result = await model.deleteFamily(objSearch);
    if(result) {
        let objKeiyakuSearch = {
            HihoFamilyNo: objSearch.FamilyNo
        }
        let keiyakuResult = await keiyakuService.getListKeiyaku(objKeiyakuSearch);
        for (let i = 0; i < keiyakuResult.data.length; i++) {
            let item = keiyakuResult.data[i];
            if (item.HihoFamilyNo !== '0') {
                let objDelete = {
                    KeiyakuNo: item.KeiyakuNo
                }
                await keiyakuService.deleteKeiyaku(objDelete);
            }
        }

        let logContent = {
            UserNo: objSearch.tokenData.user_no,
            ActionContent: baseModel.logContent.DeleteFamily,
            ActionCode: 8
        }
        await baseModel.writeLog(logContent);

        return {
            code: ResCode.SUCCESS,
            message: 'Delete successed!'
        };
    }else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot delete information!'
        }
    }
}

async function createFamily(family) {
    //check reqired parameters...
    let checkValidation = validation.checkCreateFamily(family);
    if(checkValidation.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkValidation,
        }
        return result;
    }
    let result = await model.asyncCreateFamily(family);
    if (result) {
        let logContent = {
            UserNo: family.tokenData.user_no,
            ActionContent: baseModel.logContent.RegistFamily,
            ActionCode: 5
        }
        await baseModel.writeLog(logContent);
        
        return {
            code: ResCode.SUCCESS,
            message: 'Create successed!',
            data: result.id
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot upate information!'
        }
    }
}

async function updateFamilyInfo(family) {
    //check reqired parameters...
    let checkValidation = validation.checkUpdateFamily(family);
    if(checkValidation.required) {
        let result ={
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkValidation,
        }
        return result;
    }
    let result = await model.asyncUpdateFamily(family);
    if(result) {
        let logContent = {
            UserNo: family.tokenData.user_no,
            ActionContent: baseModel.logContent.ChangeFamily,
            ActionCode: 7
        }
        await baseModel.writeLog(logContent);

        return {
            code: ResCode.SUCCESS,
            message: 'Update successed!'
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot upate information!'
        }
    }
}

module.exports = {
    getFamilyInfo,
    getListFamily,
    getInfoFamily,
    deleteFamily,
    createFamily,
    updateFamilyInfo
}