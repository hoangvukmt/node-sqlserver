const service = require('../services/VProductService');
const logService = require('../services/LogService');

async function getListProduct(request, response) {
    let startTime = new Date();
    let objSearch = {
        COMPANYCD: request.body.company_cd,
        tokenData: request.body.tokenData
    };
    let data = await service.getListProduct(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "VProductController.js" },
        { key: "Function", content: "getListProduct" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

module.exports = {
    getListProduct
}