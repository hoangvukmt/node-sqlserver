const fs = require('fs');
const systemConfig = require('config');

const ResCode = require('../util/validation').RESPONSE_CODE;
const service = require('../services/BannerService');
const logService = require('../services/LogService');
const validation = require('../util/validation');

async function getListBanner(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        BannerNo: request.body.banner_no,
        BannerF: request.body.banner_f,
        DispId: request.body.disp_id,
        AgentCd: request.body.agent_cd,
        tokenData: request.body.tokenData
    };
    let data = await service.getListBanner(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "BannerController.js" },
        { key: "Function", content: "getListBanner" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getFileBanner(request, response) {
    let startTime = new Date();
    let requiredFields = [
        'file_name'
    ];
    let checkRequired = validation.checkRequiredFields(request.query, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        let endTime = new Date();
        let logData = [
            { key: "Start time", content: startTime },
            { key: "End time", content: endTime },
            { key: "File", content: "BannerController.js" },
            { key: "Function", content: "getFileBanner" },
            { key: "Param", content: JSON.stringify(request.query) }
        ]
        logService.accessLog(logData);

        return response.json(result);
    }

    fs.readFile(systemConfig.get('TestENV.bannerPath') + '/' + request.query.file_name, function (err, data) {
        if (err) {
            return response.json({
                code: ResCode.SERVER_ERROR,
                message:'Server error!'
            });
        };
        let endTime = new Date();
        let logData = [
            { key: "Start time", content: startTime },
            { key: "End time", content: endTime },
            { key: "File", content: "BannerController.js" },
            { key: "Function", content: "getFileBanner" },
            { key: "Param", content: JSON.stringify(request.query) }
        ]
        logService.accessLog(logData);
        response.end(data);
    });
}

module.exports = {
    getListBanner,
    getFileBanner
}