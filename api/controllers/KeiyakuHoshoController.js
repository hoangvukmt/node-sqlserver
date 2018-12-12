const service = require('../services/KeiyakuHoshoService');
const logService = require('../services/LogService');

async function getListKeiyakuHosho(request, response) {
    let startTime = new Date();
    let objSearch = {
        KeiyakuNo: request.body.keiyaku_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getListKeiyakuHosho(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuHoshoController.js" },
        { key: "Function", content: "getListKeiyakuHosho" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getDetailKeiyakuHosho(request, response) {
    let startTime = new Date();
    let objSearch = {
        KeiyakuHoshoNo: request.body.keiyaku_hosho_no,
        tokenData: request.body.tokenData
    }
    let result = await service.getDetailKeiyakuHosho(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuHoshoController.js" },
        { key: "Function", content: "getDetailKeiyakuHosho" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function createKeiyakuHosho(request, response) {
    let startTime = new Date();
    let data = {
        KeiyakuNo: request.body.keiyaku_no,
        KeiyakuTokuyakuNo: request.body.keiyaku_tokuyaku_no,
        HoshoNo: request.body.hosho_no,
        HoshoName: request.body.hosho_name,
        ColumnVal: request.body.column_val,
        TypeF: request.body.type_f,
        Size: request.body.size,
        SelType: request.body.sel_type,
        SeqNo: request.body.seq_no,
        tokenData: request.body.tokenData
    }
    let result = await service.createKeiyakuHosho(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuHoshoController.js" },
        { key: "Function", content: "createKeiyakuHosho" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function updateKeiyakuHosho(request, response) {
    let startTime = new Date();
    let data = {
        KeiyakuHoshoNo: request.body.keiyaku_hosho_no,
        KeiyakuNo: request.body.keiyaku_no,
        KeiyakuTokuyakuNo: request.body.keiyaku_tokuyaku_no,
        HoshoNo: request.body.hosho_no,
        HoshoName: request.body.hosho_name,
        ColumnVal: request.body.column_val,
        TypeF: request.body.type_f,
        Size: request.body.size,
        SelType: request.body.sel_type,
        SeqNo: request.body.seq_no,
        tokenData: request.body.tokenData
    }
    let result = await service.updateKeiyakuHosho(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuHoshoController.js" },
        { key: "Function", content: "updateKeiyakuHosho" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

module.exports = {
    getListKeiyakuHosho,
    getDetailKeiyakuHosho,
    createKeiyakuHosho,
    updateKeiyakuHosho
}