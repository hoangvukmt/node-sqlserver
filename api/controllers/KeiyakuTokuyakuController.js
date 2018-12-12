const service = require('../services/KeiyakuTokuyakuService');
const logService = require('../services/LogService');

async function getListKeiyakuTokuyaku(request, response) {
    let startTime = new Date();
    let objSearch = {
        KeiyakuNo: request.body.keiyaku_no,
        tokenData: request.body.tokenData
    };
    let data = await service.getListKeiyakuTokuyaku(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuTokuyakuController.js" },
        { key: "Function", content: "getListKeiyakuTokuyaku" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getDetailKeiyakuTokuyaku(request, response) {
    let startTime = new Date();
    let objSearch = {
        KeiyakuTokuyakuNo: request.body.keiyaku_tokuyaku_no,
        tokenData: request.body.tokenData
    }
    let result = await service.getDetailKeiyakuTokuyaku(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuTokuyakuController.js" },
        { key: "Function", content: "getDetailKeiyakuTokuyaku" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function createKeiyakuTokuyaku(request, response) {
    let startTime = new Date();
    let data = {
        KeiyakuNo: request.body.keiyaku_no,
        CompanyCd: request.body.company_cd,
        ProductCd: request.body.product_cd,
        CategoryCd: request.body.category_cd,
        TokuNo: request.body.toku_no,
        TokuyakuName: request.body.tokuyaku_name,
        SeqNo: request.body.seq_no,
        tokenData: request.body.tokenData
    }
    let result = await service.createKeiyakuTokuyaku(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuTokuyakuController.js" },
        { key: "Function", content: "createKeiyakuTokuyaku" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function updateKeiyakuTokuyaku(request, response) {
    let startTime = new Date();
    let data = {
        KeiyakuTokuyakuNo: request.body.keiyaku_tokuyaku_no,
        KeiyakuNo: request.body.keiyaku_no,
        CompanyCd: request.body.company_cd,
        ProductCd: request.body.product_cd,
        CategoryCd: request.body.category_cd,
        TokuNo: request.body.toku_no,
        TokuyakuName: request.body.tokuyaku_name,
        SeqNo: request.body.seq_no,
        tokenData: request.body.tokenData
    }
    let result = await service.updateKeiyakuTokuyaku(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuTokuyakuController.js" },
        { key: "Function", content: "updateKeiyakuTokuyaku" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

module.exports = {
    getListKeiyakuTokuyaku,
    getDetailKeiyakuTokuyaku,
    createKeiyakuTokuyaku,
    updateKeiyakuTokuyaku
}