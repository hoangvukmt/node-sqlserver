const service = require('../services/VCompanyService');
const logService = require('../services/LogService');

async function getListCompany(request, response) {
    let startTime = new Date();
    let objSearch = {
        COMPANYCD: request.body.company_cd,
        tokenData: request.body.tokenData
    };
    let data = await service.getListCompany(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "VCompanyController.js" },
        { key: "Function", content: "getListCompany" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

module.exports = {
    getListCompany
}