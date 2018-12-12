const service = require('../services/ResultKaniShindanService');
const logService = require('../services/LogService');

async function getKaniShindanInfo(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getKaniShindanInfo(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "ResultKaniShindanController.js" },
        { key: "Function", content: "getKaniShindanInfo" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

//#region only kanri -------------------------------------------------------------------------------------
async function updateKaniShindanInfo(request, response) {
    let startTime = new Date();
    let objData = {
        UserNo: request.body.user_no,
        Message: request.body.message,
        lsData: request.body.data,
        TantoName: request.body.tanto_name
    };
    let data = await service.updateKaniShindanInfo(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "ResultKaniShindanController.js" },
        { key: "Function", content: "updateKaniShindanInfo" },
        { key: "Param", content: JSON.stringify(objData) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}
//#endregion

module.exports = {
    getKaniShindanInfo,
    updateKaniShindanInfo
}