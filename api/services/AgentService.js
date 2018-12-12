'use strict';
const model = require('../models/T_Agent');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');
const baseModel = require('../base/BaseModel');

async function getListAgent(objSearch) {
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
    let data = await model.getListAgent(objSearch);
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

async function createAgent(data) {
    let requiredFields = [
        'UserNo',
        'AgentName'
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

    let result = await model.createAgent(data);
    if (result) {
        let logContent = {
            UserNo: data.tokenData.user_no,
            ActionContent: baseModel.logContent.AddAgent,
            ActionCode: 18
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
            message:'Server error! Cannot create information!'
        }
    }
}

async function getInfoAgent(objSearch) {
    let requiredFields = [
        'AgentNo'
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

    let result = await model.getInfoAgent(objSearch);
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

async function deleteAgent(data) {
    let requiredFields = [
        'AgentNo'
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

    let result = await model.deleteAgent(data);
    if (result) {
        let logContent = {
            UserNo: data.tokenData.user_no,
            ActionContent: baseModel.logContent.DeleteAgent,
            ActionCode: 20
        }
        await baseModel.writeLog(logContent);

        return {
            code: ResCode.SUCCESS,
            message: 'Delete successed!'
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot delete information!'
        }
    }
}

async function updateAgent(data) {
    let requiredFields = [
        'AgentNo',
        'AgentName'
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

    let result = await model.updateAgent(data);
    if (result) {
        let logContent = {
            UserNo: data.tokenData.user_no,
            ActionContent: baseModel.logContent.ChangeAgent,
            ActionCode: 19
        }
        await baseModel.writeLog(logContent);

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

module.exports = {
    getListAgent,
    createAgent,
    getInfoAgent,
    deleteAgent,
    updateAgent
}