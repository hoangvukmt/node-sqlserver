'use strict';
const model = require('../models/T_Message');
const userModel = require('../models/T_User');
const keiyakuModel = require('../models/T_Keiyaku');
const resultKaniShindanModel = require('../models/T_ResultKaniShindan');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');
const baseModel = require('../base/BaseModel');

async function getListMessage(objSearch) {
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

    let data = await model.getListMessage(objSearch);
    var result;
    if (data) {
        let dataReturn = [];
        let checkParent = ',';
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if ((checkParent.indexOf(',' + item.ParentMessageNo + ',') < 0 && item.IconNumber === 1) || (item.ParentMessageNo.toString() === '0' && item.IconNumber === 1)) {
                dataReturn.push(item);
                checkParent += item.ParentMessageNo + ',';
            }
        }
        result = {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: dataReturn
        }
    } else {
        result = {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
    return result;
}

async function getDetailMessage(objSearch) {
    let requiredFields = [
        'MessageNo'
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

    let result = await model.getDetailMessage(objSearch);
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

async function createMessage(data) {
    let requiredFields = [
        "UserNo",
        "MessageTitle"
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

    let result = await model.createMessage(data);
    if (result) {
        /*
        if (typeof data.ParentMessageNo === "undefined" || data.ParentMessageNo === null || data.ParentMessageNo === "" || data.ParentMessageNo === 0) {
            let dataUpdate = {
                MessageNo: result.id,
                ParentMessageNo: result.id,
                notLog: true
            }
            await model.updateMessage(dataUpdate);
        }
        */
        if (typeof data.MessageType !== "undefined" && data.MessageType === 0) {
            let logContent = {
                UserNo: data.tokenData.user_no,
                ActionContent: baseModel.logContent.RequestInquiry,
                ActionCode: 9
            }
            await baseModel.writeLog(logContent);
        }
        if (typeof data.MessageType !== "undefined" && (data.MessageType === 1 || data.MessageType === 2)) {
            let reMessage = {
                ParentMessageNo: result.id,
                UserNo: data.UserNo,
                IconNumber: 1,
                notLog: true
            }
            let userUpdate;
            
            if (data.MessageType === 2) {
                let logContent = {
                    UserNo: data.tokenData.user_no,
                    ActionContent: baseModel.logContent.RequestTrailAnalysis,
                    ActionCode: 11
                }
                await baseModel.writeLog(logContent);

                reMessage.MessageType = 2;
                reMessage.MessageTitle = "「お試し証券分析」 依頼を受け付けました。";
                
                userUpdate = {
                    UserNo: data.UserNo,
                    ShokenBunsekiF: 2
                }
            }
            if (data.MessageType === 1) {
                let logContent = {
                    UserNo: data.tokenData.user_no,
                    ActionContent: baseModel.logContent.RequestDiagnostic,
                    ActionCode: 10
                }
                await baseModel.writeLog(logContent);

                reMessage.MessageType = 1;
                reMessage.MessageTitle = "「簡易診断」 依頼を受け付けました。";

                userUpdate = {
                    UserNo: data.UserNo,
                    KaniShindanF: 2
                }
                // Update T_Keiyaku KaniShindanF
                keiyakuModel.updateKaniShindanF(data.UserNo, 1);
                /*
                // Demo data T_ResultKaniShindan
                let searchResultKaniShindan = {
                    UserNo: data.UserNo
                }
                let dataResultKaniShindan = await resultKaniShindanModel.searchData(searchResultKaniShindan);
                if (dataResultKaniShindan.length === 0) {
                    let kaniShindanData = {
                        FamilyNo: data.FamilyNo,
                        UserNo: data.UserNo,
                        IsshogaiHoshoF: 1,
                        ItteiKikanHoshoF: 1,
                        FamilyShunyuF: 0,
                        SickF: 0,
                        GanF: 1,
                        ShippeiF: 1,
                        ShugyoFunoF: 0,
                        KaigoF: 0,
                        EducationFundF: 0,
                        RogoF: 1,
                        KegaF: 1,
                        CarF: 0,
                        BicycleF: 0,
                        KasaiF: 0,
                        JishinF: 0,
                        LiabilityF: 0,
                        PetF: 0,
                        TantoName: data.FamilyName,
                        Message: "「■世帯主様 40歳の時…お子様が大学へ進学する期間なので、支出が非常に膨らみます。」<br />「■世帯主様 49歳の時…貯蓄残高が無くなり、その後の借金が増加します。収入の範囲でまかなうのがとても難しいので、計画的な準備が欠かせません。複数の子供の教育費が重なると、さらに大変なので早めに準備をしてください。準備期間が短い場合には、奨学金制度や教育ローンの利用なども検討してください。」",
                        Status: 1
                    };
                    // add dummy data when request kaniShindan
                    resultKaniShindanModel.createResultKaniShindan(kaniShindanData);
                }
                */
            }
            model.createMessage(reMessage);
            userModel.updateUser(userUpdate);
        }
        
        if (typeof data.MessageType === "undefined") {
            let reMessage = {
                ParentMessageNo: result.id,
                UserNo: data.UserNo,
                IconNumber: 1,
                MessageType: 0,
                MessageTitle: 'お問い合わせ」受け付けました。',
                Message: '件名：' + data.MessageTitle + '<br />本文：' + data.Message,
                notLog: true
            }
            await model.createMessage(reMessage);
        }
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
}

async function updateMessage(data) {
    let requiredFields = [
        "MessageNo"
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

    let result = await model.updateMessage(data);
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

async function updateMessageFlag(data) {
    let requiredFields = [
        "UserNo"
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

    let result = await model.updateMessageFlag(data);
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

//#region only kanri -------------------------------------------------------------------------------------
async function getMessageByIdOrUser(objParam) {
    if(!(objParam.UserNo || objParam.MessageNo)) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: 'User no or Message No field not exitst'
        };
        return result;
    }

    let data = await model.getMessageByIdOrUser(objParam);
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

async function searchMessage(objSearch) {
    let result = await model.searchMessage(objSearch);
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

async function sendMessage(data) {
    let requiredFields = [
        "UserNo",
        "MessageType",
        "MessageTitle"
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

    let result = await model.sendMessage(data);
    if (result) {
        
        let messageUpdate = {
            MessageNo: data.ParentMessageNo,
            ParentMessageNo: data.ParentMessageNo,
            notLog: true
        }
        let result2 = await model.updateMessage(messageUpdate);        
        return {
            code: ResCode.SUCCESS,
            message: 'Send successed!',
            data: result.id
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot send information!'
        }
    }
}
//#endregion

module.exports = {
    getListMessage,
    getDetailMessage,
    createMessage,
    updateMessage,
    updateMessageFlag,
    getMessageByIdOrUser,
    searchMessage,
    sendMessage
}