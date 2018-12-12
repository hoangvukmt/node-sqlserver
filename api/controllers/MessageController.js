const service = require('../services/MessageService');
const logService = require('../services/LogService');

async function getListMessage(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        MessageType: request.body.message_type,
        displayedF: request.body.displayed,
        tokenData: request.body.tokenData
    };
    let data = await service.getListMessage(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "MessageController.js" },
        { key: "Function", content: "getListMessage" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getDetailMessage(request, response) {
    let startTime = new Date();
    let objSearch = {
        MessageNo: request.body.message_no,
        tokenData: request.body.tokenData
    }
    let result = await service.getDetailMessage(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "MessageController.js" },
        { key: "Function", content: "getDetailMessage" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function createMessage(request, response) {
    let startTime = new Date();
    let data = {
        ParentMessageNo: request.body.parent_message_no,
        UserNo: request.body.user_no,
        FamilyNo: request.body.family_no,
        FamilyName: request.body.family_name,
        MessageType: request.body.message_type,
        MessageTitle: request.body.message_title,
        Message: request.body.message,
        IconNumber: request.body.icon_number,
        TantoName: request.body.tanto_name,
        displayedF: (typeof request.body.displayed === "undefined" || request.body.displayed === null || request.body.displayed.toString().trim() === '') ? 0 : request.body.displayed,
        tokenData: request.body.tokenData
    }

    let result = await service.createMessage(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "MessageController.js" },
        { key: "Function", content: "createMessage" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function updateMessage(request, response) {
    let startTime = new Date();
    let data = {
        MessageNo: request.body.message_no,
        MessageType: request.body.message_type,
        MessageTitle: request.body.message_title,
        Message: request.body.message,
        IconNumber: request.body.icon_number,
        TantoName: request.body.tanto_name,
        tokenData: request.body.tokenData
    }
    let result = await service.updateMessage(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "MessageController.js" },
        { key: "Function", content: "updateMessage" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function updateMessageFlag(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        tokenData: request.body.tokenData
    };
    let data = await service.updateMessageFlag(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "updateMessageFlag.js" },
        { key: "Function", content: "getListMessage" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

//#region only kanri -------------------------------------------------------------------------------------
async function getMessageByIdOrUser(request, response) {
    let startTime = new Date();
    let objParam = {
        UserNo: request.body.user_no,
        MessageNo: request.body.message_no
    };

    let data = await service.getMessageByIdOrUser(objParam);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "MessageController.js" },
        { key: "Function", content: "getMessageByIdOrUser" },
        { key: "Param", content: JSON.stringify(objParam) }
    ]
    await logService.accessLog(logData);
    return response.json(data)
}

async function searchMessage(request, response) {
    let startTime = new Date();
    let objSearch = {
        FromDate: request.body.from_date,
        ToDate: request.body.to_date,
        IraiNaiyou: request.body.irai_naiyou,
        TaiouJoukyou: request.body.taiou_joukyou,
        Dairiten: request.body.dairi_ten,
        Sort: (typeof request.body.sort === "undefined" || request.body.sort === null ? [] : request.body.sort),
        Filter: (typeof request.body.filter === "undefined" || request.body.filter === null ? [] : request.body.filter),
        Page: (typeof request.body.page === "undefined" || request.body.page === null ? 1 : request.body.page),
        PageSize: (typeof request.body.pageSize === "undefined" || request.body.pageSize === null ? 10 : request.body.pageSize)
    };
    let data = await service.searchMessage(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "MessageController.js" },
        { key: "Function", content: "searchMessage" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function sendMessage(request, response) {
    let startTime = new Date();
    let data = {
        ParentMessageNo: request.body.parent_message_no,
        UserNo: request.body.user_no,        
        MessageType: request.body.message_type,
        MessageTitle: request.body.message_title,
        Message: request.body.message,
        IconNumber: request.body.icon_number,
        notLog: true
    }
    let result = await service.sendMessage(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "MessageController.js" },
        { key: "Function", content: "sendMessage" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}
//#endregion

module.exports = {
    getListMessage,
    getDetailMessage,
    createMessage,
    updateMessage,
    updateMessageFlag,
    searchMessage,
    getMessageByIdOrUser,
    sendMessage
}