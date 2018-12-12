const service = require('../services/AgentService');
const logService = require('../services/LogService');

async function getListAgent(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getListAgent(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "AgentController.js" },
        { key: "Function", content: "getListAgent" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function createAgent(request, response) {
    let startTime = new Date();
    let data = {
        UserNo: request.body.user_no,
        AgentName: request.body.agent_name,
        TantoName: request.body.tanto_name,
        Phone: request.body.phone,
        KeiyakuPage: request.body.keiyaku_page,
        Remarks: request.body.remarks,
        tokenData: request.body.tokenData
    };
    let result = await service.createAgent(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "AgentController.js" },
        { key: "Function", content: "createAgent" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function getInfoAgent(request, response) {
    let startTime = new Date();
    let objSearch = {
        AgentNo: request.body.agent_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getInfoAgent(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "AgentController.js" },
        { key: "Function", content: "getInfoAgent" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function deleteAgent(request, response) {
    let startTime = new Date();
    let data = {
        AgentNo: request.body.agent_no,
        tokenData: request.body.tokenData
    };
    let result = await service.deleteAgent(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "AgentController.js" },
        { key: "Function", content: "deleteAgent" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function updateAgent(request, response) {
    let startTime = new Date();
    let data = {
        AgentNo: request.body.agent_no,
        AgentName: request.body.agent_name,
        TantoName: request.body.tanto_name,
        Phone: request.body.phone,
        KeiyakuPage: request.body.keiyaku_page,
        Remarks: request.body.remarks,
        tokenData: request.body.tokenData
    };
    let result = await service.updateAgent(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "AgentController.js" },
        { key: "Function", content: "updateAgent" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

//#region only kanri -------------------------------------------------------------------------------------
async function createCustomerAgent(request, response) {
    let startTime = new Date();
    let data = {
        UserNo: request.body.user_no,
        AgentName: request.body.agent_name,
        TantoName: request.body.tanto_name,
        Phone: request.body.phone,
        KeiyakuPage: request.body.keiyaku_page,
        Remarks: request.body.remarks,
        tokenData: request.body.tokenData,
        notLog: true
    };
    let result = await service.createAgent(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "AgentController.js" },
        { key: "Function", content: "createCustomerAgent" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}
//#endregion

module.exports = {
    getListAgent,
    createAgent,
    getInfoAgent,
    deleteAgent,
    updateAgent,
    createCustomerAgent
}