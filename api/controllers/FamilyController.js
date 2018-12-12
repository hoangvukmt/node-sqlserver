const service = require('../services/FamilyService');
const logService = require('../services/LogService');

async function getFamilyInfo(request, response) {
    let startTime = new Date();
    let userInfo = {
        LoginId: request.body.login_id,
        tokenData: request.body.tokenData
    }
    let result = await service.getFamilyInfo(userInfo);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FamilyController.js" },
        { key: "Function", content: "getFamilyInfo" },
        { key: "Param", content: JSON.stringify(userInfo) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function getListFamily(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getListFamily(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FamilyController.js" },
        { key: "Function", content: "getListFamily" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getInfoFamily(request, response) {
    let startTime = new Date();
    let objSearch = {
        FamilyNo: request.body.family_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getInfoFamily(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FamilyController.js" },
        { key: "Function", content: "getInfoFamily" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function deleteFamily(request, response) {
    let startTime = new Date();
    let objSearch = {
        FamilyNo: request.body.family_no,
        tokenData: request.body.tokenData
    };
    let data = await service.deleteFamily(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FamilyController.js" },
        { key: "Function", content: "deleteFamily" },
        { key: "Param", content: JSON.stringify(objSearch) },
        { key: "Result", content: JSON.stringify(data)}
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function createFamilyInfo(request, response) {
    let startTime = new Date();
    let familyInfo = {
        UserNo: request.body.user_no,
        LastName : request.body.last_name,
        FirstName : request.body.first_name,
        Relation : request.body.relation,
        Sex : request.body.sex,
        Birthday : request.body.birthday ? new Date(request.body.birthday ):null,
        SeqNo : request.body.seq_no,
        tokenData: request.body.tokenData
    }
    let result = await service.createFamily(familyInfo);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FamilyController.js" },
        { key: "Function", content: "createFamilyInfo" },
        { key: "Param", content: JSON.stringify(familyInfo) },
        { key: "Result", content: JSON.stringify(result)}
    ]
    await logService.accessLog(logData);

    return response.json(result);

}

async function updateFamilyInfo(request, response) {
    let startTime = new Date();
    let familyInfo = {
        FamilyNo : request.body.family_no,
        UserNo: request.body.user_no,
        LastName : request.body.last_name,
        FirstName : request.body.first_name,
        Relation : request.body.relation,
        Sex : request.body.sex,
        Birthday : request.body.birthday ? new Date(request.body.birthday) : null,
        SeqNo : request.body.seq_no,
        tokenData: request.body.tokenData
    }
    let family = await service.updateFamilyInfo(familyInfo);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "FamilyController.js" },
        { key: "Function", content: "updateFamilyInfo" },
        { key: "Param", content: JSON.stringify(familyInfo) },
        { key: "Result", content: JSON.stringify(family)}
    ]
    await logService.accessLog(logData);

    return response.json(family);
}

module.exports = {
    getFamilyInfo,
    getListFamily,
    getInfoFamily,
    deleteFamily,
    createFamilyInfo,
    updateFamilyInfo
}