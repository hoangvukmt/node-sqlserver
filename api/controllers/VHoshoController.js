const service = require('../services/VHoshoService');
const logService = require('../services/LogService');

async function getListHosho(request, response) {
    let startTime = new Date();
    let objSearch = {
        COMPANYCD: request.body.company_cd,
        PRODUCTCD: request.body.product_cd,
        HoshoCategoryF: request.body.hosho_category_f,
        Type: request.body.type,
        tokenData: request.body.tokenData
        //CATEGORYCD: request.body.category_cd
    };
    let data = await service.getListHosho(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "VHoshoController.js" },
        { key: "Function", content: "getListHosho" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getListTokuyakuHosho(request, response) {
    let startTime = new Date();
    let objSearch = {
        COMPANYCD: request.body.company_cd,
        PRODUCTCD: request.body.product_cd,
        CATEGORYCD: request.body.category_cd,
        tokenData: request.body.tokenData
    };
    let data = await service.getListTokuyakuHosho(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "VHoshoController.js" },
        { key: "Function", content: "getListTokuyakuHosho" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getListKeiyakuHosho(request, response) {
    let startTime = new Date();
    let objSearch = {
        HoshoCategoryF: request.body.hosho_category_f,
        tokenData: request.body.tokenData
    };
    let data = await service.getListKeiyakuHosho(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "VHoshoController.js" },
        { key: "Function", content: "getListKeiyakuHosho" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

module.exports = {
    getListHosho,
    getListTokuyakuHosho,
    getListKeiyakuHosho
}