'use strict';
const model = require('../models/T_ResultKaniShindan');
const userModel = require('../models/T_User');
const messageModel = require('../models/T_Message');
const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

async function getKaniShindanInfo(objSearch) {
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
    //objSearch.UserNo = 1;
    let data = await model.getKaniShindanInfo(objSearch);
    if (data) {
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

//#region only kanri -------------------------------------------------------------------------------------
async function updateKaniShindanInfo(objData) {
    let requiredFields = [
        'UserNo',
        'lsData'
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
        let result = {
            code: ResCode.SUCCESS,
            message: 'Update success!'
        };
        let allOk = true;
        for (let i = 0; i < objData.lsData.length; i++) {
            let item = objData.lsData[i];
            let requiredItemFields = [
                'FamilyNo'
            ];
            let checkItem = validation.checkRequiredFields(item, requiredItemFields);
            if (checkItem.required) {
                result = {
                    code: ResCode.REQUIRED,
                    message: 'data[' + i + '] Parameter(s) is required!',
                    data: checkRequired
                };
                allOk = false;
                break;
            }

            let searchExist = {
                UserNo: objData.UserNo,
                FamilyNo: item.FamilyNo
            }
            let checkExist = await model.searchData(searchExist);
            if (!checkExist) {
                allOk = false;
                result = {
                    code: ResCode.SERVER_ERROR,
                    message: 'Server error!'
                };
            }
            else if (checkExist.length > 0) {
                // update
                item.isInsert = false;
            }
            else {
                // insert
                item.isInsert = true;
            }
        }

        if (allOk) {
            for (let i = 0; i < objData.lsData.length; i++) {
                let item = objData.lsData[i];
                if (item.isInsert) {
                    // insert
                    let objInsert = {
                        UserNo: objData.UserNo,
                        FamilyNo: item.FamilyNo,
                        IsshogaiHoshoF: validation.isEmptyObject(item.IsshogaiHoshoF) ? 0 : item.IsshogaiHoshoF,
                        ItteiKikanHoshoF: validation.isEmptyObject(item.ItteiKikanHoshoF) ? 0 : item.ItteiKikanHoshoF,
                        FamilyShunyuF: validation.isEmptyObject(item.FamilyShunyuF) ? 0 : item.FamilyShunyuF,
                        SickF: validation.isEmptyObject(item.SickF) ? 0 : item.SickF,
                        GanF: validation.isEmptyObject(item.GanF) ? 0 : item.GanF,
                        ShippeiF: validation.isEmptyObject(item.ShippeiF) ? 0 : item.ShippeiF,
                        ShugyoFunoF: validation.isEmptyObject(item.ShugyoFunoF) ? 0 : item.ShugyoFunoF,
                        KaigoF: validation.isEmptyObject(item.KaigoF) ? 0 : item.KaigoF,
                        EducationFundF: validation.isEmptyObject(item.EducationFundF) ? 0 : item.EducationFundF,
                        RogoF: validation.isEmptyObject(item.RogoF) ? 0 : item.RogoF,
                        KegaF: validation.isEmptyObject(item.KegaF) ? 0 : item.KegaF,
                        CarF: validation.isEmptyObject(item.CarF) ? 0 : item.CarF,
                        BicycleF: validation.isEmptyObject(item.BicycleF) ? 0 : item.BicycleF,
                        KasaiF: validation.isEmptyObject(item.KasaiF) ? 0 : item.KasaiF,
                        JishinF: validation.isEmptyObject(item.JishinF) ? 0 : item.JishinF,
                        LiabilityF: validation.isEmptyObject(item.LiabilityF) ? 0 : item.LiabilityF,
                        PetF: validation.isEmptyObject(item.PetF) ? 0 : item.PetF,
                        Message: objData.Message
                    }
                    await model.createResultKaniShindan(objInsert);
                }
                else {
                    // update
                    let objUpdate = {
                        IsshogaiHoshoF: validation.isEmptyObject(item.IsshogaiHoshoF) ? 0 : item.IsshogaiHoshoF,
                        ItteiKikanHoshoF: validation.isEmptyObject(item.ItteiKikanHoshoF) ? 0 : item.ItteiKikanHoshoF,
                        FamilyShunyuF: validation.isEmptyObject(item.FamilyShunyuF) ? 0 : item.FamilyShunyuF,
                        SickF: validation.isEmptyObject(item.SickF) ? 0 : item.SickF,
                        GanF: validation.isEmptyObject(item.GanF) ? 0 : item.GanF,
                        ShippeiF: validation.isEmptyObject(item.ShippeiF) ? 0 : item.ShippeiF,
                        ShugyoFunoF: validation.isEmptyObject(item.ShugyoFunoF) ? 0 : item.ShugyoFunoF,
                        KaigoF: validation.isEmptyObject(item.KaigoF) ? 0 : item.KaigoF,
                        EducationFundF: validation.isEmptyObject(item.EducationFundF) ? 0 : item.EducationFundF,
                        RogoF: validation.isEmptyObject(item.RogoF) ? 0 : item.RogoF,
                        KegaF: validation.isEmptyObject(item.KegaF) ? 0 : item.KegaF,
                        CarF: validation.isEmptyObject(item.CarF) ? 0 : item.CarF,
                        BicycleF: validation.isEmptyObject(item.BicycleF) ? 0 : item.BicycleF,
                        KasaiF: validation.isEmptyObject(item.KasaiF) ? 0 : item.KasaiF,
                        JishinF: validation.isEmptyObject(item.JishinF) ? 0 : item.JishinF,
                        LiabilityF: validation.isEmptyObject(item.LiabilityF) ? 0 : item.LiabilityF,
                        PetF: validation.isEmptyObject(item.PetF) ? 0 : item.PetF,
                        Message: objData.Message
                    }
                    let objCondition = {
                        UserNo: objData.UserNo,
                        FamilyNo: item.FamilyNo
                    }
                    await model.updateData(objUpdate, objCondition);
                }
                // update T_User KaniShindanF = 1
                let objUpdateUser = {
                    UserNo: objData.UserNo,
                    KaniShindanF: 1,
                    notLog: true
                }
                await userModel.updateUser(objUpdateUser);
                // get message
                let objSearchMess = {
                    MessageType: 1,
                    ParentMessageNo: 0,
                    UserNo: objData.UserNo
                };

                let lsMessage = await messageModel.getListMessage(objSearchMess);
                if (lsMessage.length > 0){
                    let messageCreate = {
                        ParentMessageNo: lsMessage[0].MessageNo,
                        UserNo: lsMessage[0].UserNo,
                        MessageType: 1,
                        MessageTitle: '「簡易診断」が完了しました。',
                        Message: 'メニュー「簡易診断」からご確認いただけます。',
                        IconNumber: 1,
                        TantoName: objData.TantoName,
                        notLog: true
                    }
                    let resultCreate = await messageModel.createMessage(messageCreate);
                    if (resultCreate) {
                        let messageUpdate = {
                            MessageNo: lsMessage[0].MessageNo,
                            ParentMessageNo: lsMessage[0].MessageNo,
                            notLog: true
                        }
                        await messageModel.updateMessage(messageUpdate);
                    }
                }

            }
        }

        return result;
    }
    else {
        return {
            code: ResCode.NOT_EXIST,
            message:'No data pound!'
        }
    }
}
//#endregion

module.exports = {
    getKaniShindanInfo,
    updateKaniShindanInfo
}