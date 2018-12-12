const service = require('../services/VTokuyakuService');
const logService = require('../services/LogService');

async function getListTokuyaku(request, response) {
    let startTime = new Date();
    let objSearch = {
        COMPANYCD: request.body.company_cd,
        PRODUCTCD: request.body.product_cd,
        CATEGORYCD: request.body.category_cd,
        HoshoCategoryF: request.body.category_f,
        tokenData: request.body.tokenData
    };
    let data = await service.getListTokuyaku(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "VTokuyakuController.js" },
        { key: "Function", content: "getListTokuyaku" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

module.exports = {
    getListTokuyaku
}