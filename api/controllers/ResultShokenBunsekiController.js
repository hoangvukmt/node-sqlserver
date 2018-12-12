const service = require('../services/ResultShokenBunsekiService');
const logService = require('../services/LogService');

async function getListShokenBunseki(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        MessageNo: request.body.message_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getListShokenBunseki(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "ResultShokenBunsekiController.js" },
        { key: "Function", content: "getListShokenBunseki" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

module.exports = {
    getListShokenBunseki
}