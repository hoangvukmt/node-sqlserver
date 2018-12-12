'use strict';
const model = require('../models/T_Group');
const keiyakuModel = require('../models/T_Keiyaku');
const validation = require('../util/validation');
const ResCode = require('../util/validation').RESPONSE_CODE;

async function createGroup(data) {
    let result = await model.createGroup(data);
    if (result) {
        // Update Keiyaku GroupID
        if (!validation.isEmptyObject(data.KeiyakuNo)) {
            let keiyakuUpdate = {
                KeiyakuNo: data.KeiyakuNo,
                GroupID: result.id,
                tokenData: data.tokenData
            }
            await keiyakuModel.updateKeiyaku(keiyakuUpdate);
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

async function updateGroup(data) {
    let requiredFields = [
        'GroupID',
        'AutoF',
        'Status'
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

    let result = await model.updateGroup(data);
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

async function getGroupDetail(objSearch) {
    let requiredFields = [
        'GroupID'
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

    let result = await model.getInfoGroup(objSearch);
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

async function validate(data) {
    // Check required param
    let requiredFields = [
        'FamilyNo',
        'hihoFamilyNo'
    ]
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        return {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
    }  

    return {
        code: ResCode.SUCCESS,
        message: ''
    }
}

module.exports = {
    createGroup,
    updateGroup,
    getGroupDetail,
    validate
}