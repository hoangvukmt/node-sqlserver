'use strict';
const model = require('../models/T_Keiyaku');
const userModel = require('../models/T_User');
const keiyakuHoshoModel = require('../models/T_KeiyakuHosho');
const keiyakuTokuyakuModel = require('../models/T_KeiyakuTokuyaku');
const resultKaniShindanModel = require('../models/T_ResultKaniShindan');
const groupModel = require('../models/T_Group');
const fileModel = require('../models/T_File');
const iqAddModel = require('../models/T_IQAdd');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');
const logService = require('./LogService');
const groupService = require('./GroupService');
const fileService = require('./FileService');
const areaService = require('./AreaService');
const commonUtil = require('../util/common');
const fs = require('fs');
const systemConfig = require('config');
const moveFile = require('move-file');
const vHoshoModel = require('../models/V_Hosho');
const messageModel = require('../models/T_Message');
const baseModel = require('../base/BaseModel');

async function getListKeiyaku(objSearch) {
    let requiredFields = [
        'HihoFamilyNo'
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

    let data = await model.getListKeiyaku(objSearch);
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

async function getDetailKeiyaku(objSearch) {
    let requiredFields = [
        'KeiyakuNo'
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

    let result = await model.getDetailKeiyaku(objSearch);
    if (result) {
        let objSearchShuKeiyaku = {
            KeiyakuNo: objSearch.KeiyakuNo,
            KeiyakuTokuyakuNo: 0
        };
        let shuKeiyaku = await keiyakuHoshoModel.getListKeiyakuHosho(objSearchShuKeiyaku, [{ key: "SeqNo", type: "ASC" }]);

        let arrTokuyaku = [];
        let objSearchTokuyaku = {
            KeiyakuNo: objSearch.KeiyakuNo
        };
        let tokuyakuResult = await keiyakuTokuyakuModel.getListKeiyakuTokuyaku(objSearchTokuyaku);
        if (tokuyakuResult) {
            for (var i = 0; i < tokuyakuResult.length; i++) {
                let tokuyaku = tokuyakuResult[i];

                let objSearchTokuyakuHosho = {
                    KeiyakuNo: objSearch.KeiyakuNo,
                    KeiyakuTokuyakuNo: tokuyaku.KeiyakuTokuyakuNo
                };
                let tokuyakuHosho = await keiyakuHoshoModel.getListKeiyakuHosho(objSearchTokuyakuHosho, [{ key: "SeqNo", type: "ASC" }]);
                if (tokuyakuHosho) {
                    tokuyaku.tokuyakuHoshos = tokuyakuHosho;
                }
                arrTokuyaku.push(tokuyaku);
            }
        }
        let objSearchHosho = {
            HoshoCategoryF: result.HoshoCategoryF
        };
        let keiyakuHosho = await vHoshoModel.getListKeiyakuHosho(objSearchHosho);

        let dataReturn = {
            FileName: result.FileName,
            keiyakuField: result,
            keiyaku: [],
            shuKeiyaku: shuKeiyaku,
            tokuyakus: arrTokuyaku
        };
        
        for (var i = 0; i < keiyakuHosho.length; i++) {
            let item = keiyakuHosho[i];
            if (item.HoshoNo === '1') {
                let value;
                if (item.TypeF !== 70) {
                    value = result.AgentNo;
                }
                else {
                    value = result.AgentName;
                }
                dataReturn.keiyaku.push({ title: item.HoshoName, value: value, column: "AgentName", error: item.TypeF !== 70 ? true : false });
            }
            if (item.HoshoNo === '2') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.CompanyName, column: "CompanyName", error: item.TypeF !== 50 ? true : false });
            }
            if (item.HoshoNo === '3') {
                let value;
                if (item.TypeF !== 90) {
                    value = result.HoshoCategoryF;
                }
                else {
                    value = result.HoshoCategoryName;
                }
                dataReturn.keiyaku.push({ title: item.HoshoName, value: value, column: "HoshoCategoryName", error: item.TypeF !== 90 ? true : false });
            }
            if (item.HoshoNo === '4') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.ProductName, column: "ProductName", error: item.TypeF !== 60 ? true : false });
            }
            if (item.HoshoNo === '5') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.PolicyNo, column: "PolicyNo", error: item.TypeF !== 1 ? true : false });
            }
            if (item.HoshoNo === '6') {
                let value;
                if (item.TypeF !== 20) {
                    value = result.Status;
                }
                else {
                    value = result.StatusName;
                }
                dataReturn.keiyaku.push({ title: item.HoshoName, value: value, column: "StatusName", error: item.TypeF !== 20 ? true : false });
            }
            if (item.HoshoNo === '7') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.FamilyName, column: "FamilyName", error: item.TypeF !== 40 ? true : false });
            }
            if (item.HoshoNo === '8') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.HihoFamilyName, column: "HihoFamilyName", error: item.TypeF !== 40 ? true : false });
            }
            if (item.HoshoNo === '9') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.ContractDate, column: "ContractDate", error: item.TypeF !== 30 ? true : false });
            }
            if (item.HoshoNo === '10') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.ContractDate, column: "ContractDate", error: item.TypeF !== 30 ? true : false });
            }
            if (item.HoshoNo === '11') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.HokenEndDate, column: "HokenEndDate", error: item.TypeF !== 30 ? true : false });
            }
            if (item.HoshoNo === '12') {
                let value;
                if (item.TypeF !== 80) {
                    value = result.HKikan;
                }
                else {
                    value = result.HKikanName;
                }
                dataReturn.keiyaku.push({ title: item.HoshoName, value: value, column: "HKikanName", error: item.TypeF !== 80 ? true : false });
            }
            if (item.HoshoNo === '13') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: (result.HokenP !== null ? (result.HokenP + result.CurrencyFName) : ''), column: "HokenP", error: item.TypeF !== 100 ? true : false });
            }
            if (item.HoshoNo === '14') {
                let value;
                if (item.TypeF !== 20) {
                    value = result.Haraikata;
                }
                else {
                    value = result.HaraikataName;
                }
                dataReturn.keiyaku.push({ title: item.HoshoName, value: value, column: "HaraikataName", error: item.TypeF !== 20 ? true : false });
            }
            if (item.HoshoNo === '15') {
                let value;
                if (result.Haraikata !== null && result.Haraikata.toString() === '6') {
                    value = '';
                }
                else {
                    if (item.TypeF !== 80) {
                        value = result.PKikan;
                    }
                    else {
                        value = result.PKikanName;
                    }
                }
                dataReturn.keiyaku.push({ title: item.HoshoName, value: value, column: "PKikanName", error: item.TypeF !== 80 ? true : false });
            }
            if (item.HoshoNo === '16') {
                let value;
                if (item.TypeF !== 20) {
                    value = result.ForeignF;
                }
                else {
                    value = result.ForeignFName;
                }
                dataReturn.keiyaku.push({ title: item.HoshoName, value: value, column: "ForeignFName", error: item.TypeF !== 20 ? true : false });
            }
            if (item.HoshoNo === '17') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.ContactAccident, column: "ContactAccident", error: item.TypeF !== 3 ? true : false });
            }
            if (item.HoshoNo === '18') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.ContactCarFailure, column: "ContactCarFailure", error: item.TypeF !== 3 ? true : false });
            }
            if (item.HoshoNo === '19') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.CarName, column: "CarName", error: item.TypeF !== 0 ? true : false });
            }
            if (item.HoshoNo === '20') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.RegistNo, column: "RegistNo", error: item.TypeF !== 0 ? true : false });
            }
            if (item.HoshoNo === '21') {
                dataReturn.keiyaku.push({ title: item.HoshoName, value: result.Address, column: "Address", error: item.TypeF !== 0 ? true : false });
            }
        }

        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: dataReturn
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}

async function createKeiyaku(data) {
    let requiredFields = [
        'GroupID'
    ];
    
    if (data.CreateType === 'HANDLE' && typeof data.HoshoCategoryF !== "undefined" && data.HoshoCategoryF !== null) {
        let objSearchHosho = {
            HoshoCategoryF: data.HoshoCategoryF
        };
        let keiyakuHosho = await vHoshoModel.getListKeiyakuHosho(objSearchHosho);
        for (var i = 0; i < keiyakuHosho.length; i++) {
            let item = keiyakuHosho[i];
    
            if (item.HoshoNo === '1' && item.requiredF === 1) {
                requiredFields.push('AgentNo');
            }
            if (item.HoshoNo === '2' && item.requiredF === 1) {
                requiredFields.push('CompanyName');
            }
            if (item.HoshoNo === '3' && item.requiredF === 1) {
                requiredFields.push('HoshoCategoryF');
            }
            if (item.HoshoNo === '4' && item.requiredF === 1) {
                requiredFields.push('ProductName');
            }
            if (item.HoshoNo === '5' && item.requiredF === 1) {
                requiredFields.push('PolicyNo');
            }
            if (item.HoshoNo === '6' && item.requiredF === 1) {
                requiredFields.push('Status');
            }
            if (item.HoshoNo === '7' && item.requiredF === 1) {
                requiredFields.push('FamilyName');
            }
            if (item.HoshoNo === '8' && item.requiredF === 1) {
                requiredFields.push('HihoFamilyName');
            }
            if (item.HoshoNo === '9' && item.requiredF === 1) {
                requiredFields.push('ContractDate');
            }
            if (item.HoshoNo === '11' && item.requiredF === 1) {
                requiredFields.push('HokenEndDate');
            }
            if (item.HoshoNo === '12' && item.requiredF === 1) {
                if (item.TypeF === 80) {
                    requiredFields.push('HKikan');
                    requiredFields.push('HKikanF');
                }
                else {
                    requiredFields.push('HKikan');
                }
            }
            if (item.HoshoNo === '13' && item.requiredF === 1) {
                if (item.TypeF === 100) {
                    requiredFields.push('HokenP');
                    requiredFields.push('CurrencyF');
                }
                else {
                    requiredFields.push('HokenP');
                }
            }
            if (item.HoshoNo === '14' && item.requiredF === 1) {
                requiredFields.push('Haraikata');
            }
            if (item.HoshoNo === '15' && item.requiredF === 1) {
                if (item.TypeF === 80) {
                    requiredFields.push('PKikan');
                    requiredFields.push('PKikanF');
                }
                else {
                    requiredFields.push('PKikan');
                }
            }
            if (item.HoshoNo === '16' && item.requiredF === 1) {
                requiredFields.push('ForeignF');
            }
            if (item.HoshoNo === '17' && item.requiredF === 1) {
                requiredFields.push('ContactAccident');
            }
            if (item.HoshoNo === '18' && item.requiredF === 1) {
                requiredFields.push('ContactCarFailure');
            }
            if (item.HoshoNo === '19' && item.requiredF === 1) {
                requiredFields.push('CarName');
            }
            if (item.HoshoNo === '20' && item.requiredF === 1) {
                requiredFields.push('RegistNo');
            }
            if (item.HoshoNo === '21' && item.requiredF === 1) {
                requiredFields.push('Address');
            }
        }
    }
    
    // Validate keiyaku data
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Keiyaku parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }
    // Validate shukeiyaku data
    if (typeof data.shuKeiyaku !== "undefined" && data.shuKeiyaku.length > 0) {
        let requiredShukeiyaku = [
            "HoshoNo",
            "HoshoName",
            "TypeF",
            "Size",
            "SelType",
            "SeqNo"
        ]
        for (var i = 0; i < data.shuKeiyaku.length; i++){
            let hosho = data.shuKeiyaku[i];
            let checkHosho = validation.checkRequiredAlowEmpty(hosho, requiredShukeiyaku, ',HoshoName,');
            if (checkHosho.required) {
                let result = {
                    code: ResCode.REQUIRED,
                    message: 'Shukeiyaku hosho[' + (i + 1) + '] Parameter(s) is required!',
                    data: checkHosho
                };
                return result;
            }
        }
    }
    // Validate tokuyaku data
    if (typeof data.tokuyakus !== "undefined" && data.tokuyakus.length > 0) {
        let requiredTokuyaku = [
            "TokuyakuName"
        ];
        for (var i = 0; i < data.tokuyakus.length; i++) {
            let tokuyaku = data.tokuyakus[i];
            let checkTokuyaku = validation.checkRequiredAlowEmpty(tokuyaku, requiredTokuyaku, ',TokuyakuName,');
            if (checkTokuyaku.required) {
                let result = {
                    code: ResCode.REQUIRED,
                    message: 'Tokuyaku[' + (i + 1) + '] Parameter(s) is required!',
                    data: checkTokuyaku
                };
                return result;
            }

            // Validate tokuyaku hosho
            if (tokuyaku.tokuyakuHoshos.length > 0) {
                let requiredTokuyakuHosho = [
                    "HoshoNo",
                    "HoshoName",
                    "TypeF",
                    "Size",
                    "SelType",
                    "SeqNo"
                ];
                for (var j = 0; j < tokuyaku.tokuyakuHoshos.length; j++) {
                    let hosho = tokuyaku.tokuyakuHoshos[j];
                    let checkHosho = validation.checkRequiredAlowEmpty(hosho, requiredTokuyakuHosho, ',HoshoName,');
                    if (checkHosho.required) {
                        let result = {
                            code: ResCode.REQUIRED,
                            message: 'Tokuyaku[' + (i + 1) + '] hosho[' + (j + 1) + '] Parameter(s) is required!',
                            data: checkHosho
                        };
                        return result;
                    }
                }
            }
        }
    }

    // Create file upload
    if (typeof data.fileUploads !== "undefined" && data.fileUploads !== null && data.fileUploads.length > 0) {
        let uploadResult = await processFileUpload(true, data);
        if (uploadResult.code === ResCode.SUCCESS) {
            data.GroupID = uploadResult.data;
        }
        else {
            return uploadResult;
        }
    }

    // Create keiyaku info
    let result = await model.createKeiyaku(data);
    if (result) {
        if (data.CreateType === 'HANDLE') {
            let logContent = {
                UserNo: data.tokenData.user_no,
                ActionContent: baseModel.logContent.AddHoken,
                ActionCode: 13
            }
            await baseModel.writeLog(logContent);
        }
        else {
            let logContent = {
                UserNo: data.tokenData.user_no,
                ActionContent: baseModel.logContent.RequestAutoInput,
                ActionCode: 12
            }
            await baseModel.writeLog(logContent);
        }

        // Create shukeiyaku info
        if (typeof data.shuKeiyaku !== "undefined" && data.shuKeiyaku.length > 0) {
            for (var i = 0; i < data.shuKeiyaku.length; i++) {
                let hosho = data.shuKeiyaku[i];
                hosho.KeiyakuNo = result.id;
                hosho.KeiyakuTokuyakuNo = 0;
                hosho.HoshoName = (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '';

                let createResult = await keiyakuHoshoModel.createKeiyakuHosho(hosho);
                if (!createResult) {
                    let logData = [
                        { key: "Time", content: new Date() },
                        { key: "File", content: "KeiyakuService.js" },
                        { key: "Function", content: "createKeiyaku" },
                        { key: "Line", content: 217 },
                        { key: "Err", content: "Create shukeiyaku hosho fail: " + hosho.HoshoName }
                    ]
                    await logService.errorLog(logData);
                }
            }
        }
        // Create tokuyaku info
        if (typeof data.tokuyakus !== "undefined" && data.tokuyakus.length > 0) {
            for (var i = 0; i < data.tokuyakus.length; i++) {
                let tokuyaku = data.tokuyakus[i];
                let objTokuyaku = {
                    KeiyakuNo: result.id,
                    CompanyCd: tokuyaku.CompanyCd,
                    ProductCd: tokuyaku.ProductCd,
                    CategoryCd: tokuyaku.CategoryCd,
                    TokuNo: tokuyaku.TokuNo,
                    TokuyakuName: (typeof tokuyaku.TokuyakuName !== 'undefined' && tokuyaku.TokuyakuName !== null && tokuyaku.TokuyakuName.trim() !== '') ? tokuyaku.TokuyakuName : '',
                    SeqNo: tokuyaku.SeqNo
                }
                let resultTokuyaku = await keiyakuTokuyakuModel.createKeiyakuTokuyaku(objTokuyaku);
                if (resultTokuyaku) {
                    // Create tokuyaku hosho info
                    if (tokuyaku.tokuyakuHoshos.length > 0) {
                        for (var j = 0; j < tokuyaku.tokuyakuHoshos.length; j++) {
                            let hosho = tokuyaku.tokuyakuHoshos[j];
                            hosho.KeiyakuNo = result.id;
                            hosho.KeiyakuTokuyakuNo = resultTokuyaku.id;
                            hosho.HoshoName = (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '';

                            let createResult = await keiyakuHoshoModel.createKeiyakuHosho(hosho);
                            if (!createResult) {
                                let logData = [
                                    { key: "Time", content: new Date() },
                                    { key: "File", content: "KeiyakuService.js" },
                                    { key: "Function", content: "createKeiyaku" },
                                    { key: "Line", content: 252 },
                                    { key: "Err", content: "Create tokuyaku hosho fail: " + hosho.KeiyakuTokuyakuNo }
                                ]
                                await logService.errorLog(logData);
                            }
                        }
                    }
                }
                else {
                    let logData = [
                        { key: "Time", content: new Date() },
                        { key: "File", content: "KeiyakuService.js" },
                        { key: "Function", content: "createKeiyaku" },
                        { key: "Line", content: 243 },
                        { key: "Err", content: "Create tokuyaku fail: " + tokuyaku.TokuyakuName }
                    ]
                    await logService.errorLog(logData);
                }
            }
        }

        return {
            code: ResCode.SUCCESS,
            message: 'Create successed!',
            data: {
                KeiyakuId: result.id,
                GroupId: data.GroupID
            }
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot create information!'
        }
    }
}

async function updateKeiyaku(data) {
    let requiredFields = [
        'KeiyakuNo',
        'GroupID'
    ]
    if (typeof data.HoshoCategoryF !== "undefined" && data.HoshoCategoryF !== null) {
        let objSearchHosho = {
            HoshoCategoryF: data.HoshoCategoryF
        };
        let keiyakuHosho = await vHoshoModel.getListKeiyakuHosho(objSearchHosho);
        for (var i = 0; i < keiyakuHosho.length; i++) {
            let item = keiyakuHosho[i];
    
            if (item.HoshoNo === '1' && item.requiredF === 1) {
                requiredFields.push('AgentNo');
            }
            if (item.HoshoNo === '2' && item.requiredF === 1) {
                requiredFields.push('CompanyName');
            }
            if (item.HoshoNo === '3' && item.requiredF === 1) {
                requiredFields.push('HoshoCategoryF');
            }
            if (item.HoshoNo === '4' && item.requiredF === 1) {
                requiredFields.push('ProductName');
            }
            if (item.HoshoNo === '5' && item.requiredF === 1) {
                requiredFields.push('PolicyNo');
            }
            if (item.HoshoNo === '6' && item.requiredF === 1) {
                requiredFields.push('Status');
            }
            if (item.HoshoNo === '7' && item.requiredF === 1) {
                requiredFields.push('FamilyName');
            }
            if (item.HoshoNo === '8' && item.requiredF === 1) {
                requiredFields.push('HihoFamilyName');
            }
            if (item.HoshoNo === '9' && item.requiredF === 1) {
                requiredFields.push('ContractDate');
            }
            if (item.HoshoNo === '11' && item.requiredF === 1) {
                requiredFields.push('HokenEndDate');
            }
            if (item.HoshoNo === '12' && item.requiredF === 1) {
                if (item.TypeF === 80) {
                    requiredFields.push('HKikan');
                    requiredFields.push('HKikanF');
                }
                else {
                    requiredFields.push('HKikan');
                }
            }
            if (item.HoshoNo === '13' && item.requiredF === 1) {
                if (item.TypeF === 100) {
                    requiredFields.push('HokenP');
                    requiredFields.push('CurrencyF');
                }
                else {
                    requiredFields.push('HokenP');
                }
            }
            if (item.HoshoNo === '14' && item.requiredF === 1) {
                requiredFields.push('Haraikata');
            }
            if (item.HoshoNo === '15' && item.requiredF === 1) {
                if (item.TypeF === 80) {
                    requiredFields.push('PKikan');
                    requiredFields.push('PKikanF');
                }
                else {
                    requiredFields.push('PKikan');
                }
            }
            if (item.HoshoNo === '16' && item.requiredF === 1) {
                requiredFields.push('ForeignF');
            }
            if (item.HoshoNo === '17' && item.requiredF === 1) {
                requiredFields.push('ContactAccident');
            }
            if (item.HoshoNo === '18' && item.requiredF === 1) {
                requiredFields.push('ContactCarFailure');
            }
            if (item.HoshoNo === '19' && item.requiredF === 1) {
                requiredFields.push('CarName');
            }
            if (item.HoshoNo === '20' && item.requiredF === 1) {
                requiredFields.push('RegistNo');
            }
            if (item.HoshoNo === '21' && item.requiredF === 1) {
                requiredFields.push('Address');
            }
        }
    }

    // Validate keiyaku data
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Keiyaku parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }
    // Validate shukeiyaku data
    if (typeof data.shuKeiyaku !== "undefined" && data.shuKeiyaku.length > 0) {
        let requiredShukeiyaku = [
            "HoshoNo",
            "HoshoName",
            "TypeF",
            "Size",
            "SelType",
            "SeqNo"
        ]
        for (var i = 0; i < data.shuKeiyaku.length; i++){
            let hosho = data.shuKeiyaku[i];
            let checkHosho = validation.checkRequiredAlowEmpty(hosho, requiredShukeiyaku, ',HoshoName,');
            if (checkHosho.required) {
                let result = {
                    code: ResCode.REQUIRED,
                    message: 'Shukeiyaku hosho[' + (i + 1) + '] Parameter(s) is required!',
                    data: checkHosho
                };
                return result;
            }
        }
    }
    // Validate tokuyaku data
    if (typeof data.tokuyakus !== "undefined" && data.tokuyakus.length > 0) {
        let requiredTokuyaku = [
            "TokuyakuName"
        ];
        for (var i = 0; i < data.tokuyakus.length; i++) {
            let tokuyaku = data.tokuyakus[i];
            let checkTokuyaku = validation.checkRequiredAlowEmpty(tokuyaku, requiredTokuyaku, ',TokuyakuName,');
            if (checkTokuyaku.required) {
                let result = {
                    code: ResCode.REQUIRED,
                    message: 'Tokuyaku[' + (i + 1) + '] Parameter(s) is required!',
                    data: checkTokuyaku
                };
                return result;
            }

            // Validate tokuyaku hosho
            if (tokuyaku.tokuyakuHoshos.length > 0) {
                let requiredTokuyakuHosho = [
                    "HoshoNo",
                    "HoshoName",
                    "TypeF",
                    "Size",
                    "SelType",
                    "SeqNo"
                ];
                for (var j = 0; j < tokuyaku.tokuyakuHoshos.length; j++) {
                    let hosho = tokuyaku.tokuyakuHoshos[j];
                    let checkHosho = validation.checkRequiredAlowEmpty(hosho, requiredTokuyakuHosho, ',HoshoName,');
                    if (checkHosho.required) {
                        let result = {
                            code: ResCode.REQUIRED,
                            message: 'Tokuyaku[' + (i + 1) + '] hosho[' + (j + 1) + '] Parameter(s) is required!',
                            data: checkHosho
                        };
                        return result;
                    }
                }
            }
        }
    }

    // Process file upload
    if (typeof data.GroupID !== "undefined" && data.GroupID !== null && data.GroupID.toString() !== "0") {
        let uploadResult = await processFileUpload(false, data);
        if (uploadResult.code !== ResCode.SUCCESS) {
            return uploadResult;
        }
    }
    /*
    else {
        // Create file upload
        if (typeof data.fileUploads !== "undefined" && data.fileUploads !== null && data.fileUploads.length > 0) {
            let uploadResult = await processFileUpload(true, data);
            if (uploadResult.code === ResCode.SUCCESS) {
                data.GroupID = uploadResult.data;
            }
            else {
                return uploadResult;
            }
        }
    }
    */
    // Update keiyaku info
    let result = await model.updateKeiyaku(data);
    if (result) {
        let logContent = {
            UserNo: data.tokenData.user_no,
            ActionContent: baseModel.logContent.ChangeHoken,
            ActionCode: 14
        }
        await baseModel.writeLog(logContent);

        // Update user KaniShindanF
        let searchResultKaniShindan = {
            UserNo: data.tokenData.user_no
        }
        let dataResultKaniShindan = await resultKaniShindanModel.searchData(searchResultKaniShindan);
        if (dataResultKaniShindan.length > 0) {
            let userUpdate = {
                UserNo: data.tokenData.user_no,
                KaniShindanF: 1,
                tokenData: data.tokenData
            }
            userModel.updateUser(userUpdate);
        }

        // Update T_Group
        if (typeof data.GroupID !== "undefined" && data.GroupID !== null && data.GroupID.toString() !== "0") {
            let objGroup = {
                GroupID: data.GroupID
            };
            let groupDetail = await groupModel.getInfoGroup(objGroup);
            if (groupDetail) {
                let groupUpdate = {
                    GroupID: groupDetail.GroupID,
                    FamilyNo: data.FamilyNo,
                    hihoFamilyNo: data.HihoFamilyNo ,
                    tokenData: data.tokenData
                }
                groupModel.updateGroup(groupUpdate);
            }
        }

        // Update shukeiyaku
        if (typeof data.shuKeiyaku !== "undefined" && data.shuKeiyaku.length > 0) {
            for (var i = 0; i < data.shuKeiyaku.length; i++) {
                let hosho = data.shuKeiyaku[i];
                
                if (validation.isEmptyObject(hosho.KeiyakuHoshoNo)) {
                    let hoshoCreate = {
                        KeiyakuNo: data.KeiyakuNo,
                        KeiyakuTokuyakuNo: 0,
                        HoshoNo: hosho.HoshoNo,
                        HoshoName: (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '',
                        ColumnVal: hosho.ColumnVal,
                        ColumnOption: hosho.ColumnOption,
                        Comment: hosho.Comment,
                        TypeF: hosho.TypeF,
                        Size: hosho.Size,
                        SelType: hosho.SelType,
                        SeqNo: hosho.SeqNo,
                        tokenData: data.tokenData
                    }
                    let createResult = await keiyakuHoshoModel.createKeiyakuHosho(hoshoCreate);
                    if (!createResult) {
                        let logData = [
                            { key: "Time", content: new Date() },
                            { key: "File", content: "KeiyakuService.js" },
                            { key: "Function", content: "updateKeiyaku" },
                            { key: "Line", content: 422 },
                            { key: "Err", content: "Create shukeiyaku hosho fail: " + hosho.HoshoName }
                        ]
                        await logService.errorLog(logData);
                    }
                }
                else {
                    let hoshoUpdate = {
                        KeiyakuHoshoNo: hosho.KeiyakuHoshoNo,
                        HoshoNo: hosho.HoshoNo,
                        HoshoName: (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '',
                        ColumnVal: hosho.ColumnVal,
                        ColumnOption: hosho.ColumnOption,
                        Comment: hosho.Comment,
                        TypeF: hosho.TypeF,
                        Size: hosho.Size,
                        SelType: hosho.SelType,
                        SeqNo: hosho.SeqNo,
                        tokenData: data.tokenData
                    }
                    let updateResult = await keiyakuHoshoModel.updateKeiyakuHosho(hoshoUpdate);
                    if (!updateResult) {
                        let logData = [
                            { key: "Time", content: new Date() },
                            { key: "File", content: "KeiyakuService.js" },
                            { key: "Function", content: "updateKeiyaku" },
                            { key: "Line", content: 445 },
                            { key: "Err", content: "Update shukeiyaku hosho fail: " + hosho.KeiyakuHoshoNo }
                        ]
                        await logService.errorLog(logData);
                    }
                }
            }
        }

        // Update tokuyaku
        if (typeof data.tokuyakus !== "undefined" && data.tokuyakus.length > 0) {
            for (var i = 0; i < data.tokuyakus.length; i++) {
                let tokuyaku = data.tokuyakus[i];
                // Create new
                if (validation.isEmptyObject(tokuyaku.KeiyakuTokuyakuNo)) {
                    tokuyaku.KeiyakuNo = data.KeiyakuNo;
                    let resultTokuyaku = await keiyakuTokuyakuModel.createKeiyakuTokuyaku(tokuyaku);
                    if (resultTokuyaku) {
                        if (tokuyaku.tokuyakuHoshos.length > 0) {
                            for (var j = 0; j < tokuyaku.tokuyakuHoshos.length; j++) {
                                let hosho = tokuyaku.tokuyakuHoshos[j];
                                let hoshoData = {
                                    KeiyakuNo: data.KeiyakuNo,
                                    KeiyakuTokuyakuNo: resultTokuyaku.id,
                                    HoshoNo: hosho.HoshoNo,
                                    HoshoName: (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '',
                                    ColumnVal: hosho.ColumnVal,
                                    ColumnOption: hosho.ColumnOption,
                                    Comment: hosho.Comment,
                                    TypeF: hosho.TypeF,
                                    Size: hosho.Size,
                                    SelType: hosho.SelType,
                                    SeqNo: hosho.SeqNo,
                                    tokenData: data.tokenData
                                }
                                let createResult = await keiyakuHoshoModel.createKeiyakuHosho(hoshoData);
                                if (!createResult) {
                                    let logData = [
                                        { key: "Time", content: new Date() },
                                        { key: "File", content: "KeiyakuService.js" },
                                        { key: "Function", content: "updateKeiyaku" },
                                        { key: "Line", content: 483 },
                                        { key: "Err", content: "Create tokuyaku hosho fail: " + hosho.HoshoName }
                                    ]
                                    await logService.errorLog(logData);
                                }
                            }
                        }
                    }
                }
                else {
                    let tokuyakuUpdate = {
                        KeiyakuTokuyakuNo: tokuyaku.KeiyakuTokuyakuNo,
                        CompanyCd: tokuyaku.CompanyCd,
                        ProductCd: tokuyaku.ProductCd,
                        CategoryCd: tokuyaku.CategoryCd,
                        TokuNo: tokuyaku.TokuNo,
                        TokuyakuName: (typeof tokuyaku.TokuyakuName !== 'undefined' && tokuyaku.TokuyakuName !== null && tokuyaku.TokuyakuName.trim() !== '') ? tokuyaku.TokuyakuName : '',
                        SeqNo: tokuyaku.SeqNo,
                        tokenData: data.tokenData
                    }
                    let updateResult = keiyakuTokuyakuModel.updateKeiyakuTokuyaku(tokuyakuUpdate);
                    if (!updateResult) {
                        let logData = [
                            { key: "Time", content: new Date() },
                            { key: "File", content: "KeiyakuService.js" },
                            { key: "Function", content: "updateKeiyaku" },
                            { key: "Line", content: 508 },
                            { key: "Err", content: "UPdate tokuyaku fail: " + tokuyaku.KeiyakuTokuyakuNo }
                        ]
                        await logService.errorLog(logData);
                    }
                    else {
                        if (tokuyaku.tokuyakuHoshos.length > 0) {
                            for (var j = 0; j < tokuyaku.tokuyakuHoshos.length; j++) {
                                let hosho = tokuyaku.tokuyakuHoshos[j];

                                let hoshoData = {
                                    KeiyakuNo: data.KeiyakuNo,
                                    KeiyakuTokuyakuNo: tokuyaku.KeiyakuTokuyakuNo,
                                    HoshoNo: hosho.HoshoNo,
                                    HoshoName: (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '',
                                    ColumnVal: hosho.ColumnVal,
                                    ColumnOption: hosho.ColumnOption,
                                    Comment: hosho.Comment,
                                    TypeF: hosho.TypeF,
                                    Size: hosho.Size,
                                    SelType: hosho.SelType,
                                    SeqNo: hosho.SeqNo,
                                    tokenData: data.tokenData
                                }
                                if (validation.isEmptyObject(hosho.KeiyakuHoshoNo)) {
                                    let createResult = await keiyakuHoshoModel.createKeiyakuHosho(hoshoData);
                                    if (!createResult) {
                                        let logData = [
                                            { key: "Time", content: new Date() },
                                            { key: "File", content: "KeiyakuService.js" },
                                            { key: "Function", content: "updateKeiyaku" },
                                            { key: "Line", content: 536 },
                                            { key: "Err", content: "Create tokuyaku hosho fail: " + hosho.HoshoName }
                                        ]
                                        await logService.errorLog(logData);
                                    }
                                }
                                else {
                                    hoshoData.KeiyakuHoshoNo = hosho.KeiyakuHoshoNo;
                                    let updateResult = await keiyakuHoshoModel.updateKeiyakuHosho(hoshoData);
                                    if (!updateResult) {
                                        let logData = [
                                            { key: "Time", content: new Date() },
                                            { key: "File", content: "KeiyakuService.js" },
                                            { key: "Function", content: "updateKeiyaku" },
                                            { key: "Line", content: 550 },
                                            { key: "Err", content: "Update tokuyaku hosho fail: " + hosho.HoshoName }
                                        ]
                                        await logService.errorLog(logData);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Delete shukeiyaku
        if (typeof data.shukeiyakuDelete !== "undefined" && data.shukeiyakuDelete.length > 0) {
            for (var i = 0; i < data.shukeiyakuDelete.length; i++) {
                let objDelete = {
                    KeiyakuHoshoNo: data.shukeiyakuDelete[i],
                    tokenData: data.tokenData
                }
                keiyakuHoshoModel.deleteKeiyakuHosho(objDelete);
            }
        }

        // Delete tokuyaku
        if (typeof data.tokuyakusDelete !== "undefined" && data.tokuyakusDelete.length > 0) {
            for (var i = 0; i < data.tokuyakusDelete.length; i++) {
                let objDelete = {
                    KeiyakuTokuyakuNo: data.tokuyakusDelete[i],
                    tokenData: data.tokenData
                }
                let deleteResult = keiyakuTokuyakuModel.deleteKeiyakuTokuyaku(objDelete);
                if (deleteResult) {
                    keiyakuHoshoModel.deleteKeiyakuHosho(objDelete);
                }
            }
        }

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

async function deleteKeiyaku(objSearch) {
    let requiredFields = [
        'KeiyakuNo'
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

    let keiyakuDetail = await model.getDetailKeiyaku(objSearch);
    if (keiyakuDetail) {
        let result = await model.deleteKeiyaku(objSearch);
        if(result) {
            let logContent = {
                UserNo: objSearch.tokenData.user_no,
                ActionContent: baseModel.logContent.DeleteHoken,
                ActionCode: 15
            }
            await baseModel.writeLog(logContent);

            if (keiyakuDetail.GroupID.toString() !== '0') {
                let objGroupUpdate = {
                    DelF: 1,
                    GroupID: keiyakuDetail.GroupID,
                    tokenData: objSearch.tokenData
                };
                await groupModel.updateGroup(objGroupUpdate);

                let objFileUpdate = {
                    GroupID: keiyakuDetail.GroupID,
                    tokenData: objSearch.tokenData
                }
                await fileModel.deleteGroupFile(objFileUpdate);
            }

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
    else {
        return {
            code: ResCode.NOT_EXIST,
            message:'not pound!'
        }
    }
}

async function getKeiyakuByUser(objSearch) {
    let data = await model.getKeiyakuByUser(objSearch);
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

async function processFileUpload(isCreate, data) {
    let fileNameDb = '画像' + commonUtil.dateToyyyyMMddHHmm(new Date());
    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath'))){
        fs.mkdirSync(systemConfig.get('TestENV.uploadPath'));
    }
    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no)){
        fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no);
    }
    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo)){
        fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo);
    }

    if (isCreate) {
        // inser data to T_Group
        let folderName = data.tokenData.user_no + "/" + data.HihoFamilyNo;

        let groupInfo = {
            FamilyNo: data.FamilyNo,
            hihoFamilyNo: data.HihoFamilyNo,
            FilePath: folderName,
            FileName: fileNameDb,
            tokenData: data.tokenData
        }
        let result = await groupService.createGroup(groupInfo);
        if (result.code === ResCode.SUCCESS) {
            for (var i = 0; i < data.fileUploads.length; i++) {
                // insert data to T_File
                let file = data.fileUploads[i];
                let fileInfo = {
                    GroupID: result.data,
                    FileID: (i + 1),
                    ImgFileName: file.fileName,
                    JsonFileName: null,
                    MenuFileName: fileNameDb + '_' + (i + 1),
                    DelF: 0,
                    tokenData: data.tokenData
                }
                let fileResult = await fileService.createFile(fileInfo);
                if (fileResult.code === ResCode.SUCCESS) {
                    // Move file from temp to file path
                    if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo + "/" + result.data)){
                        fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo + "/" + result.data);
                    }
                    (async () => {
                        await moveFile(systemConfig.get('TestENV.tempUpload') + '/' + file.fileName, systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo + "/" + result.data + "/" + file.fileName);
                    })();
                    // Create edit info
                    if (typeof file.editInfo !== "undefined") {
                        let objArea = {
                            GroupID: result.data,
                            FileID: (i + 1),
                            UpLeftX: file.editInfo.upLeft_x,
                            UpLeftY: file.editInfo.upLeft_y,
                            UpRightX: file.editInfo.upRight_x,
                            UpRightY: file.editInfo.upRight_y,
                            BottomLeftX: file.editInfo.bottomLeft_x,
                            BottomLeftY: file.editInfo.bottomLeft_y,
                            BottomRightX: file.editInfo.bottomRight_x,
                            BottomRightY: file.editInfo.bottomRight_y,
                            Rotate: file.editInfo.rotate,
                            tokenData: data.tokenData
                        }
                        await areaService.createArea(objArea);
                    }
                }
            }
            return {
                code: ResCode.SUCCESS,
                data: result.data
            }
        }
        else {
            return {
                code: ResCode.SERVER_ERROR,
                message:'Server error! Cannot create information!'
            }
        }
    }
    else {
        // make folder
        if (!fs.existsSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo + "/" + data.GroupID)){
            fs.mkdirSync(systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo + "/" + data.GroupID);
        }
        // get Group info
        let objSearch = {
            GroupID: data.GroupID
        }
        let groupData = await groupModel.getInfoGroup(objSearch);
        if (groupData) {
            let objSearchFile = {
                GroupID: data.GroupID
            }
            let lstFile = await fileModel.getAllFile(objSearchFile);

            // Change hihofamily => move file from old hihofamily folder to new hihofamily folder
            if (groupData.hihoFamilyNo.toString() !== data.HihoFamilyNo.toString()) {
                let groupUpdate = {
                    GroupID: data.GroupID,
                    FilePath: data.tokenData.user_no + "/" + data.HihoFamilyNo,
                    tokenData: data.tokenData
                }
                let groupResult = await groupModel.updateGroup(groupUpdate);
                if (groupResult) {
                    if (lstFile) {
                        for (var i = 0; i < lstFile.length; i++) {
                            let item = lstFile[i];
                            (async () => {
                                await moveFile(systemConfig.get('TestENV.uploadPath') + '/' + groupData.FilePath + '/' + data.GroupID + '/' + item.ImgFileName, systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo + "/" + data.GroupID + "/" + item.ImgFileName);
                            })();
                        }
                    }
                }
                else {
                    return {
                        code: ResCode.SERVER_ERROR,
                        message:'Server error! Cannot create information!'
                    }
                }
            }
            // Upload new file
            if (typeof data.fileUploads !== "undefined" && data.fileUploads !== null && data.fileUploads.length > 0) {
                let lastFileId = 0;
                if (lstFile) {
                    lastFileId = lstFile.data.length + 1;
                }

                for (var i = 0; i < data.fileUploads.length; i++) {
                    // insert data to T_File
                    let file = data.fileUploads[i];
                    let fileInfo = {
                        GroupID: data.GroupID,
                        FileID: lastFileId,
                        ImgFileName: file.fileName,
                        JsonFileName: null,
                        MenuFileName: fileNameDb + '_' + lastFileId,
                        DelF: 0,
                        tokenData: data.tokenData
                    }
                    let fileResult = await fileService.createFile(fileInfo);
                    if (fileResult.code === ResCode.SUCCESS) {
                        // Move file from temp to file path
                        (async () => {
                            await moveFile(systemConfig.get('TestENV.tempUpload') + '/' + file.fileName, systemConfig.get('TestENV.uploadPath') + "/" + data.tokenData.user_no + "/" + data.HihoFamilyNo + "/" + data.GroupID + "/" + file.fileName);
                        })();
                    }
                    lastFileId++;
                }
            }
            return {
                code: ResCode.SUCCESS
            }
        }
    }
}

async function updateGroupId(data) {
    let requiredFields = [
        'KeiyakuNo',
        'GroupID'
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
    let result = await model.updateKeiyaku(data);
    if(result) {
        return {
            code: ResCode.SUCCESS,
            message: 'Update successed!'
        };
    }else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot update information!'
        }
    }
}

//#region only kanri -------------------------------------------------------------------------------------
async function getListProductByUser(objParam) {
    let requiredFields = [
        'UserNo'
    ]
    // Validate keiyaku data
    let checkRequired = validation.checkRequiredFields(objParam, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Keiyaku parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let data = await model.getListProductByUser(objParam.UserNo);
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

async function getProductDetail(objParam) {
    let requiredFields = [
        'KeiyakuNo'
    ]
    // Validate keiyaku data
    let checkRequired = validation.checkRequiredFields(objParam, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'KeiyakuNo parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let data = await model.getProductDetail(objParam);
    let result;
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

async function getProductByKeiyakuno(objParam) {
    let requiredFields = [
        'KeiyakuNo'
    ]
    // Validate keiyaku data
    let checkRequired = validation.checkRequiredFields(objParam, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'KeiyakuNo parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let data = await model.getProductByKeiyakuno(objParam);
    let result;
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

async function sendKeiToSystem(objData) {
    let requiredFields = [
        'UserNo',
        'IqCustomerNo'
    ];
    let checkRequired = validation.checkRequiredFields(objData, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    if (objData.lsData.length > 0) {
        // update registeredF for each keiyaku
        for (var i = 0; i < objData.lsData.length; i++) {
            let kei = objData.lsData[i];
            let objUpdate = {
                KeiyakuNo: kei.KeiyakuNo,
                registeredF: 1,
                notLog: true
            }
            await model.updateKeiyaku(objUpdate);
        }
        // add new data to T_IQAdd
        let objIQAdd = {
            UserNo: objData.UserNo,
            BranchCd: objData.tokenData.BranchCd,
            ClerkCd: objData.tokenData.ClerkCd,
            UserId: objData.tokenData.UserId,
            IqCustomerNo: objData.IqCustomerNo,
            notLog: true
        }
        await iqAddModel.createNew(objIQAdd);
    }
    
    return {
        code: ResCode.SUCCESS,
        message: 'Update success!'
    };
}

async function requestOCRList(objSearch) {
    let result = await model.requestOCRList(objSearch);
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

async function deleteOCRList(objSearch) {
    let result = await model.deleteOCRList(objSearch);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message:'delete successed!',            
            rowsAffected: result
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}

async function processKeiyakuAuto(objData) {
    let result = {
        code: ResCode.SUCCESS,
        message: 'Update success!'
    };
    let requiredFields = [
        'KeiyakuInfo',
        'MessageInfo'
    ];
    let checkRequired = validation.checkRequiredFields(objData, requiredFields);
    if (checkRequired.required) {
        result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    if (objData.Type === "REJECT") {
        let keiyakuField = [
            'KeiyakuNo'
        ];
        let checkKeiyakuField = validation.checkRequiredFields(objData.KeiyakuInfo, keiyakuField);
        if (checkKeiyakuField.required) {
            result = {
                code: ResCode.REQUIRED,
                message: 'Keiyaku parameter(s) is required!',
                data: checkKeiyakuField
            };
            return result;
        }

        let messageField = [
            'UserNo',
            'MessageTitle',
            'MessageContent',
            'TantoName'
        ];
        let checkMessageField = validation.checkRequiredFields(objData.MessageInfo, messageField);
        if (checkMessageField.required) {
            result = {
                code: ResCode.REQUIRED,
                message: 'Message parameter(s) is required!',
                data: checkMessageField
            };
            return result;
        }

        let keiyakuUpdate = {
            KeiyakuNo: objData.KeiyakuInfo.KeiyakuNo,
            NyuryokuF: 1,
            ProductName: '「自動入力エラー」',
            notLog: true
        }
        let resultUpdate = await model.updateKeiyaku(keiyakuUpdate);
        if (!resultUpdate) {
            return {
                code: ResCode.SERVER_ERROR,
                message:'Server error! Cannot create information!'
            }
        }
        else {
            // send message
            let newMessage = {
                ParentMessageNo: 0,
                UserNo: objData.MessageInfo.UserNo,
                MessageType: 0,
                MessageTitle: objData.MessageInfo.MessageTitle,
                Message: objData.MessageInfo.MessageContent,
                IconNumber: 0,
                TantoName: objData.MessageInfo.TantoName,
                notLog: true
            }
            await messageModel.createMessage(newMessage);
        }
    }
    else {
        let keiyakuFields = [
            'KeiyakuNo',
            'FamilyNo',
            'HihoFamilyNo',
            'AgentNo',
            'Status'
        ]
        // Validate keiyaku data
        let checkKeiyakuField = validation.checkRequiredFields(objData.KeiyakuInfo, keiyakuFields);
        if (checkKeiyakuField.required) {
            let result = {
                code: ResCode.REQUIRED,
                message: 'Keiyaku parameter(s) is required!',
                data: checkKeiyakuField
            };
            return result;
        }

        // Validate shukeiyaku data
        if (typeof objData.KeiyakuInfo.shuKeiyaku !== "undefined" && objData.KeiyakuInfo.shuKeiyaku.length > 0) {
            let requiredShukeiyaku = [
                "HoshoNo",
                "HoshoName",
                "TypeF",
                "Size",
                "SelType",
                "SeqNo"
            ]
            for (var i = 0; i < objData.KeiyakuInfo.shuKeiyaku.length; i++){
                let hosho = objData.KeiyakuInfo.shuKeiyaku[i];
                let checkHosho = validation.checkRequiredAlowEmpty(hosho, requiredShukeiyaku, ',HoshoName,');
                if (checkHosho.required) {
                    let result = {
                        code: ResCode.REQUIRED,
                        message: 'Shukeiyaku hosho[' + (i + 1) + '] Parameter(s) is required!',
                        data: checkHosho
                    };
                    return result;
                }
            }
        }
        // Validate tokuyaku data
        if (typeof objData.KeiyakuInfo.tokuyakus !== "undefined" && objData.KeiyakuInfo.tokuyakus.length > 0) {
            let requiredTokuyaku = [
                "TokuyakuName"
            ];
            for (var i = 0; i < objData.KeiyakuInfo.tokuyakus.length; i++) {
                let tokuyaku = objData.KeiyakuInfo.tokuyakus[i];
                let checkTokuyaku = validation.checkRequiredAlowEmpty(tokuyaku, requiredTokuyaku, ',TokuyakuName,');
                if (checkTokuyaku.required) {
                    let result = {
                        code: ResCode.REQUIRED,
                        message: 'Tokuyaku[' + (i + 1) + '] Parameter(s) is required!',
                        data: checkTokuyaku
                    };
                    return result;
                }

                // Validate tokuyaku hosho
                if (tokuyaku.tokuyakuHosho.length > 0) {
                    let requiredTokuyakuHosho = [
                        "HoshoNo",
                        "HoshoName",
                        "TypeF",
                        "Size",
                        "SelType",
                        "SeqNo"
                    ];
                    for (var j = 0; j < tokuyaku.tokuyakuHosho.length; j++) {
                        let hosho = tokuyaku.tokuyakuHosho[j];
                        let checkHosho = validation.checkRequiredAlowEmpty(hosho, requiredTokuyakuHosho, ',HoshoName,');
                        if (checkHosho.required) {
                            let result = {
                                code: ResCode.REQUIRED,
                                message: 'Tokuyaku[' + (i + 1) + '] hosho[' + (j + 1) + '] Parameter(s) is required!',
                                data: checkHosho
                            };
                            return result;
                        }
                    }
                }
            }
        }

        // Update keiyaku info
        objData.KeiyakuInfo.notLog = true;
        objData.KeiyakuInfo.ContractDate = (typeof objData.KeiyakuInfo.ContractDate !== 'undefined' && objData.KeiyakuInfo.ContractDate !== null && objData.KeiyakuInfo.ContractDate !== '') ? new Date(objData.KeiyakuInfo.ContractDate) : null;
        objData.KeiyakuInfo.HokenEndDate = (typeof objData.KeiyakuInfo.HokenEndDate !== 'undefined' && objData.KeiyakuInfo.HokenEndDate !== null && objData.KeiyakuInfo.HokenEndDate !== '') ? new Date(objData.KeiyakuInfo.HokenEndDate) : null;
        objData.KeiyakuInfo.HokenP = (typeof objData.KeiyakuInfo.HokenP !== 'undefined' && objData.KeiyakuInfo.HokenP !== null) ? objData.KeiyakuInfo.HokenP.toString().replace(/,/g, '').replace(/円/g, '') : null;
        objData.KeiyakuInfo.CurrencyF = (typeof objData.KeiyakuInfo.CurrencyF !== 'undefined' && objData.KeiyakuInfo.CurrencyF !== null && objData.KeiyakuInfo.CurrencyF !== '') ? objData.KeiyakuInfo.CurrencyF : 0;
        objData.KeiyakuInfo.ForeignF = (typeof objData.KeiyakuInfo.ForeignF !== 'undefined' && objData.KeiyakuInfo.ForeignF !== null && objData.KeiyakuInfo.ForeignF !== '') ? objData.KeiyakuInfo.ForeignF : 0;
        objData.KeiyakuInfo.NyuryokuF = 1;
        let result = await model.updateKeiyaku(objData.KeiyakuInfo);
        if (result) {
            // Update shukeiyaku
            if (typeof objData.KeiyakuInfo.shuKeiyaku !== "undefined" && objData.KeiyakuInfo.shuKeiyaku.length > 0) {
                for (var i = 0; i < objData.KeiyakuInfo.shuKeiyaku.length; i++) {
                    let hosho = objData.KeiyakuInfo.shuKeiyaku[i];
                    
                    if (validation.isEmptyObject(hosho.KeiyakuHoshoNo)) {
                        let hoshoCreate = {
                            KeiyakuNo: objData.KeiyakuInfo.KeiyakuNo,
                            KeiyakuTokuyakuNo: 0,
                            HoshoNo: hosho.HoshoNo,
                            HoshoName: (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '',
                            ColumnVal: hosho.ColumnVal,
                            ColumnOption: (hosho.ColumnOption !== null && hosho.ColumnOption !== '') ? hosho.ColumnOption : null,
                            TypeF: hosho.TypeF,
                            Size: hosho.Size,
                            SelType: hosho.SelType,
                            SeqNo: hosho.SeqNo,
                            Comment: hosho.Comment,
                            tokenData: objData.tokenData,
                            notLog: true
                        }
                        let createResult = await keiyakuHoshoModel.createKeiyakuHosho(hoshoCreate);
                        if (!createResult) {
                            let logData = [
                                { key: "Time", content: new Date() },
                                { key: "File", content: "KeiyakuService.js" },
                                { key: "Function", content: "processKeiyakuAuto" },
                                { key: "Line", content: 1288 },
                                { key: "Err", content: "Create shukeiyaku hosho fail: " + hosho.HoshoName }
                            ]
                            await logService.errorLog(logData);
                        }
                    }
                    else {
                        let hoshoUpdate = {
                            KeiyakuHoshoNo: hosho.KeiyakuHoshoNo,
                            HoshoNo: hosho.HoshoNo,
                            HoshoName: (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '',
                            ColumnVal: hosho.ColumnVal,
                            ColumnOption: (hosho.ColumnOption !== null && hosho.ColumnOption !== '') ? hosho.ColumnOption : null,
                            TypeF: hosho.TypeF,
                            Size: hosho.Size,
                            SelType: hosho.SelType,
                            SeqNo: hosho.SeqNo,
                            Comment: hosho.Comment,
                            tokenData: objData.tokenData,
                            notLog: true
                        }
                        let updateResult = await keiyakuHoshoModel.updateKeiyakuHosho(hoshoUpdate);
                        if (!updateResult) {
                            let logData = [
                                { key: "Time", content: new Date() },
                                { key: "File", content: "KeiyakuService.js" },
                                { key: "Function", content: "processKeiyakuAuto" },
                                { key: "Line", content: 1313 },
                                { key: "Err", content: "Update shukeiyaku hosho fail: " + hosho.KeiyakuHoshoNo }
                            ]
                            await logService.errorLog(logData);
                        }
                    }
                }
            }
            
            // Update tokuyaku
            if (typeof objData.KeiyakuInfo.tokuyakus !== "undefined" && objData.KeiyakuInfo.tokuyakus.length > 0) {
                for (var i = 0; i < objData.KeiyakuInfo.tokuyakus.length; i++) {
                    let tokuyaku = objData.KeiyakuInfo.tokuyakus[i];
                    // Create new
                    if (validation.isEmptyObject(tokuyaku.KeiyakuTokuyakuNo)) {
                        let tokuyakuCreate = {
                            CategoryCd: tokuyaku.CategoryCd,
                            CompanyCd: tokuyaku.CompanyCd,
                            KeiyakuNo: objData.KeiyakuInfo.KeiyakuNo,
                            ProductCd: tokuyaku.ProductCd,
                            SeqNo: tokuyaku.SeqNo,
                            TokuNo: tokuyaku.TokuNo,
                            TokuyakuName: (typeof tokuyaku.TokuyakuName !== 'undefined' && tokuyaku.TokuyakuName !== null && tokuyaku.TokuyakuName.trim() !== '') ? tokuyaku.TokuyakuName : ''
                        }
                        let resultTokuyaku = await keiyakuTokuyakuModel.createKeiyakuTokuyaku(tokuyakuCreate);
                        if (resultTokuyaku) {
                            if (tokuyaku.tokuyakuHosho.length > 0) {
                                for (var j = 0; j < tokuyaku.tokuyakuHosho.length; j++) {
                                    let hosho = tokuyaku.tokuyakuHosho[j];
                                    let hoshoData = {
                                        KeiyakuNo: objData.KeiyakuInfo.KeiyakuNo,
                                        KeiyakuTokuyakuNo: resultTokuyaku.id,
                                        HoshoNo: hosho.HoshoNo,
                                        HoshoName: (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '',
                                        ColumnVal: hosho.ColumnVal,
                                        ColumnOption: (hosho.ColumnOption !== null && hosho.ColumnOption !== '') ? hosho.ColumnOption : null,
                                        TypeF: hosho.TypeF,
                                        Size: hosho.Size,
                                        SelType: hosho.SelType,
                                        SeqNo: hosho.SeqNo,
                                        Comment: hosho.Comment,
                                        tokenData: objData.tokenData,
                                        notLog: true
                                    }
                                    let createResult = await keiyakuHoshoModel.createKeiyakuHosho(hoshoData);
                                    if (!createResult) {
                                        let logData = [
                                            { key: "Time", content: new Date() },
                                            { key: "File", content: "KeiyakuService.js" },
                                            { key: "Function", content: "processKeiyakuAuto" },
                                            { key: "Line", content: 1353 },
                                            { key: "Err", content: "Create tokuyaku hosho fail: " + hosho.HoshoName }
                                        ]
                                        await logService.errorLog(logData);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        let tokuyakuUpdate = {
                            KeiyakuTokuyakuNo: tokuyaku.KeiyakuTokuyakuNo,
                            CompanyCd: tokuyaku.CompanyCd,
                            ProductCd: tokuyaku.ProductCd,
                            CategoryCd: tokuyaku.CategoryCd,
                            TokuNo: tokuyaku.TokuNo,
                            TokuyakuName: (typeof tokuyaku.TokuyakuName !== 'undefined' && tokuyaku.TokuyakuName !== null && tokuyaku.TokuyakuName.trim() !== '') ? tokuyaku.TokuyakuName : '',
                            SeqNo: tokuyaku.SeqNo,
                            tokenData: objData.tokenData,
                            notLog: true
                        }
                        let updateResult = keiyakuTokuyakuModel.updateKeiyakuTokuyaku(tokuyakuUpdate);
                        if (!updateResult) {
                            let logData = [
                                { key: "Time", content: new Date() },
                                { key: "File", content: "KeiyakuService.js" },
                                { key: "Function", content: "processKeiyakuAuto" },
                                { key: "Line", content: 1380 },
                                { key: "Err", content: "UPdate tokuyaku fail: " + tokuyaku.KeiyakuTokuyakuNo }
                            ]
                            await logService.errorLog(logData);
                        }
                        else {
                            if (tokuyaku.tokuyakuHosho.length > 0) {
                                for (var j = 0; j < tokuyaku.tokuyakuHosho.length; j++) {
                                    let hosho = tokuyaku.tokuyakuHosho[j];

                                    let hoshoData = {
                                        KeiyakuNo: objData.KeiyakuInfo.KeiyakuNo,
                                        KeiyakuTokuyakuNo: tokuyaku.KeiyakuTokuyakuNo,
                                        HoshoNo: hosho.HoshoNo,
                                        HoshoName: (typeof hosho.HoshoName !== 'undefined' && hosho.HoshoName !== null && hosho.HoshoName.trim() !== '') ? hosho.HoshoName : '',
                                        ColumnVal: hosho.ColumnVal,
                                        ColumnOption: (hosho.ColumnOption !== null && hosho.ColumnOption !== '') ? hosho.ColumnOption : null,
                                        TypeF: hosho.TypeF,
                                        Size: hosho.Size,
                                        SelType: hosho.SelType,
                                        SeqNo: hosho.SeqNo,
                                        Comment: hosho.Comment,
                                        tokenData: objData.tokenData,
                                        notLog: true
                                    }
                                    if (validation.isEmptyObject(hosho.KeiyakuHoshoNo)) {
                                        let createResult = await keiyakuHoshoModel.createKeiyakuHosho(hoshoData);
                                        if (!createResult) {
                                            let logData = [
                                                { key: "Time", content: new Date() },
                                                { key: "File", content: "KeiyakuService.js" },
                                                { key: "Function", content: "processKeiyakuAuto" },
                                                { key: "Line", content: 1410 },
                                                { key: "Err", content: "Create tokuyaku hosho fail: " + hosho.HoshoName }
                                            ]
                                            await logService.errorLog(logData);
                                        }
                                    }
                                    else {
                                        hoshoData.KeiyakuHoshoNo = hosho.KeiyakuHoshoNo;
                                        let updateResult = await keiyakuHoshoModel.updateKeiyakuHosho(hoshoData);
                                        if (!updateResult) {
                                            let logData = [
                                                { key: "Time", content: new Date() },
                                                { key: "File", content: "KeiyakuService.js" },
                                                { key: "Function", content: "processKeiyakuAuto" },
                                                { key: "Line", content: 1424 },
                                                { key: "Err", content: "Update tokuyaku hosho fail: " + hosho.HoshoName }
                                            ]
                                            await logService.errorLog(logData);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Delete shukeiyaku
            if (typeof objData.KeiyakuInfo.shukeiyakuDelete !== "undefined" && objData.KeiyakuInfo.shukeiyakuDelete.length > 0) {
                for (var i = 0; i < objData.KeiyakuInfo.shukeiyakuDelete.length; i++) {
                    let objDelete = {
                        KeiyakuHoshoNo: objData.KeiyakuInfo.shukeiyakuDelete[i],
                        tokenData: objData.tokenData,
                        notLog: true
                    }
                    keiyakuHoshoModel.deleteKeiyakuHosho(objDelete);
                }
            }

            // Delete tokuyaku
            if (typeof objData.KeiyakuInfo.tokuyakusDelete !== "undefined" && objData.KeiyakuInfo.tokuyakusDelete.length > 0) {
                for (var i = 0; i < objData.KeiyakuInfo.tokuyakusDelete.length; i++) {
                    let objDelete = {
                        KeiyakuTokuyakuNo: objData.KeiyakuInfo.tokuyakusDelete[i],
                        tokenData: objData.tokenData,
                        notLog: true
                    }
                    let deleteResult = keiyakuTokuyakuModel.deleteKeiyakuTokuyaku(objDelete);
                    if (deleteResult) {
                        keiyakuHoshoModel.deleteKeiyakuHosho(objDelete);
                    }
                }
            }

            // send message
            let newMessage = {
                ParentMessageNo: 0,
                UserNo: objData.MessageInfo.UserNo,
                MessageType: 0,
                MessageTitle: objData.MessageInfo.MessageTitle,
                Message: objData.MessageInfo.MessageContent,
                IconNumber: 1,
                TantoName: objData.MessageInfo.TantoName,
                notLog: true
            }
            await messageModel.createMessage(newMessage);

            return {
                code: ResCode.SUCCESS,
                message: 'Update successed!'
            };
        }
        else {
            return {
                code: ResCode.SERVER_ERROR,
                message:'Server error! Cannot update information!'
            }
        }
    }
    
    return result
}
//#endregion

module.exports = {
    getListKeiyaku,
    getDetailKeiyaku,
    createKeiyaku,
    updateKeiyaku,
    deleteKeiyaku,
    getKeiyakuByUser,
    updateGroupId,
    getListProductByUser,
    getProductDetail,
    sendKeiToSystem,
    getProductByKeiyakuno,
    requestOCRList,
    deleteOCRList,
    processKeiyakuAuto
}