const service = require('../services/SelectItemService');
const logService = require('../services/LogService');

async function getListSelectItem(request, response) {
    let startTime = new Date();
    let objSearch = {
        selType: request.body.sel_type,
        selNo: request.body.sel_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getListSelectItem(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "SelectItemController.js" },
        { key: "Function", content: "getListSelectItem" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

module.exports = {
    getListSelectItem
}