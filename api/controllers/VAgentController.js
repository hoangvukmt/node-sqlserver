const service = require('../services/VAgentService');
const logService = require('../services/LogService');

async function getListAgent(request, response) {
    let startTime = new Date();
    let objSearch = {
        KaniShindanUseF: request.body.kani_shindan_use_f,
        ShokenBunsekiUseF: request.body.shoken_bunseki_use_f,
        KeiyakuPageUseF: request.body.keiyaku_page_use_f,
        tokenData: request.body.tokenData
    };
    let data = await service.getListAgent(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "VAgentController.js" },
        { key: "Function", content: "getListAgent" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

module.exports = {
    getListAgent
}