'use strict';
const model = require('../models/T_Area');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');
const fileModel = require('../models/T_File');

async function getListArea(objSearch) {
    objSearch.DelF = 0;
    let data = await model.getListArea(objSearch);
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

async function createArea(data) {
    let requiredFields = [
        'GroupID'
        ,'FileID'
        ,'UpLeftX'
        ,'UpLeftY'
        ,'UpRightX'
        ,'UpRightY'
        ,'BottomLeftX'
        ,'BottomLeftY'
        ,'BottomRightX'
        ,'BottomRightY'
        ,'Rotate'
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

    let searchFile = {
        GroupID: data.GroupID,
        FileID: data.FileID
    }
    let resultFile = await fileModel.getFileDetail(searchFile);
    if (resultFile) {
        let objSearchArea = {
            DelF: 0,
            GroupID: data.GroupID
        }
        let areaId = 1;
        let lsArea = await model.getListArea(objSearchArea);
        if (lsArea.length > 0) {
            areaId = lsArea.length + 1;
        }

        data.AreaID = areaId;
        let result = await model.createArea(data);
        if (result) {
            return {
                code: ResCode.SUCCESS,
                message: 'Create successed!'
            };
        } else {
            return {
                code: ResCode.SERVER_ERROR,
                message:'Server error! Cannot create information!'
            }
        }
    } else {
        return {
            code: ResCode.NOT_EXIST,
            message:'Image do not exist!'
        }
    }
}

module.exports = {
    getListArea,
    createArea
}