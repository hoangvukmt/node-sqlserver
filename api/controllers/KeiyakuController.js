const service = require('../services/KeiyakuService');
const logService = require('../services/LogService');

async function getListKeiyaku(request, response) {
    let startTime = new Date();
    let objSearch = {
        GroupID: request.body.group_id,
        FamilyNo: request.body.family_no,
        HihoFamilyNo: request.body.hiho_family_no,
        AgentNo: request.body.agent_no,
        HoshoCategoryF: request.body.hosho_category_f,
        Status: request.body.status,
        tokenData: request.body.tokenData
    };
    let data = await service.getListKeiyaku(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "getListKeiyaku" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getDetailKeiyaku(request, response) {
    let startTime = new Date();
    let objSearch = {
        KeiyakuNo: request.body.keiyaku_no,
        tokenData: request.body.tokenData
    }
    let result = await service.getDetailKeiyaku(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "getDetailKeiyaku" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function createKeiyaku(request, response) {
    let startTime = new Date();
    let data = {
        CreateType: (typeof request.body.create === "undefined" || typeof request.body.create === null) ? 'HANDLE' : 'AUTO',
        GroupID: request.body.group_id,
        FamilyNo: request.body.family_no,
        FamilyName: request.body.family_name,
        HihoFamilyNo: request.body.hiho_family_no,
        HihoFamilyName: request.body.hiho_family_name,
        AgentNo: request.body.agent_no,
        CompanyCd: request.body.company_cd,
        CompanyName: request.body.company_name,
        TantoNameCompany: request.body.tanto_name_company,
        Phone: request.body.phone,
        URL: request.body.url,
        Memo: request.body.memo,
        HoshoCategoryF: request.body.hosho_category_f,
        ProductCd: request.body.product_cd,
        ProductName: request.body.product_name,
        CategoryCd: request.body.category_cd,
        PolicyNo: request.body.policy_no,
        Status: request.body.status,
        ContractDate: request.body.contract_date ? new Date(request.body.contract_date) : null,
        HokenEndDate: request.body.hoken_end_date? new Date(request.body.hoken_end_date) : null,
        HKikanF: request.body.h_kikan_f,
        HKikan: request.body.h_kikan,
        HokenP: typeof request.body.hoken_p !== "undefined" && request.body.hoken_p !== null ? request.body.hoken_p.toString().replace(/,/g, '').replace(/円/g, '') : null,
        Haraikata: request.body.haraikata,
        PKikanF: request.body.p_kikan_f,
        PKikan: request.body.p_kikan,
        KaniShindanF: request.body.kani_shindan_f,
        ShokenBunsekiF: request.body.shoken_bunseki_f,
        TantoNameKeiyaku: request.body.tanto_name_keiyaku,
        NyuryokuF: request.body.nyuryoku_f,
        ForeignF: (typeof request.body.foreign_f !== 'undefined' && request.body.foreign_f !== null && request.body.foreign_f.toString().trim() !== '') ? request.body.foreign_f : 0,
        ContactAccident: request.body.contact_accident,
        ContactCarFailure: request.body.contact_car_failure,
        CarName: request.body.car_name,
        RegistNo: request.body.regist_no,
        Address: request.body.address,
        CurrencyF: (typeof request.body.currency_f !== 'undefined' && request.body.currency_f !== null && request.body.currency_f.toString().trim() !== '') ? request.body.currency_f : 0,
        shuKeiyaku: request.body.shukeiyaku,
        tokuyakus: request.body.tokuyakus,
        fileUploads: request.body.file_uploads,
        //fileUploads: typeof request.body.file_uploads !== "undefined" && request.body.file_uploads !== null && request.body.file_uploads !== "" ? JSON.parse(request.body.file_uploads) : [],
        tokenData: request.body.tokenData
    }
    let result = await service.createKeiyaku(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "createKeiyaku" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function updateKeiyaku(request, response) {
    let startTime = new Date();
    let data = {
        KeiyakuNo: request.body.keiyaku_no,
        GroupID: request.body.group_id,
        FamilyNo: request.body.family_no,
        FamilyName: request.body.family_name,
        HihoFamilyNo: request.body.hiho_family_no,
        HihoFamilyName: request.body.hiho_family_name,
        AgentNo: request.body.agent_no,
        CompanyCd: request.body.company_cd,
        CompanyName: request.body.company_name,
        TantoNameCompany: request.body.tanto_name_company,
        Phone: request.body.phone,
        URL: request.body.url,
        Memo: request.body.memo,
        HoshoCategoryF: request.body.hosho_category_f,
        ProductCd: request.body.product_cd,
        ProductName: request.body.product_name,
        CategoryCd: request.body.category_cd,
        PolicyNo: request.body.policy_no,
        Status: request.body.status,
        ContractDate: request.body.contract_date ? new Date(request.body.contract_date) : null,
        HokenEndDate: request.body.hoken_end_date? new Date(request.body.hoken_end_date) : null,
        HKikanF: request.body.h_kikan_f,
        HKikan: request.body.h_kikan,
        HokenP: typeof request.body.hoken_p !== "undefined" &&  request.body.hoken_p !== null ? request.body.hoken_p.toString().replace(/,/g, '').replace(/円/g, '') : null,
        Haraikata: request.body.haraikata,
        PKikanF: request.body.p_kikan_f,
        PKikan: request.body.p_kikan,
        KaniShindanF: request.body.kani_shindan_f,
        ShokenBunsekiF: request.body.shoken_bunseki_f,
        TantoNameKeiyaku: request.body.tanto_name_keiyaku,
        ForeignF: (typeof request.body.foreign_f !== 'undefined' && request.body.foreign_f !== null && request.body.foreign_f.toString().trim() !== '') ? request.body.foreign_f : 0,
        ContactAccident: request.body.contact_accident,
        ContactCarFailure: request.body.contact_car_failure,
        CarName: request.body.car_name,
        RegistNo: request.body.regist_no,
        Address: request.body.address,
        CurrencyF: (typeof request.body.currency_f !== 'undefined' && request.body.currency_f !== null && request.body.currency_f.toString().trim() !== '') ? request.body.currency_f : 0,
        shuKeiyaku: request.body.shukeiyaku,
        tokuyakus: request.body.tokuyakus,
        shukeiyakuDelete: request.body.shukeiyaku_delete,
        tokuyakusDelete: request.body.tokuyakus_delete,
        tokenData: request.body.tokenData
    }
    let result = await service.updateKeiyaku(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "updateKeiyaku" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function deleteKeiyaku(request, response) {
    let startTime = new Date();
    let objSearch = {
        KeiyakuNo: request.body.keiyaku_no,
        tokenData: request.body.tokenData
    }
    let result = await service.deleteKeiyaku(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "deleteKeiyaku" },
        { key: "Param", content: JSON.stringify(objSearch) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function getKeiyakuByUser(request, response) {
    let startTime = new Date();
    let objSearch = {
        UserNo: request.body.user_no,
        KaniShindanF: request.body.kani_shindan_f,
        tokenData: request.body.tokenData
    };
    let data = await service.getKeiyakuByUser(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "getKeiyakuByUser" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

//#region only kanri -------------------------------------------------------------------------------------
async function getListProductByUser(request, response) {
    let startTime = new Date();
    let objParam = {
        UserNo: request.body.user_no
    };
    let data = await service.getListProductByUser(objParam);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "getListProductByCategory" },
        { key: "Param", content: JSON.stringify(objParam) }
    ]

    await logService.accessLog(logData);
    return response.json(data)
}

async function getProductDetail(request, response) {
    let startTime = new Date();
    let objParam = {
        KeiyakuNo: request.body.keiyaku_no
    };
    let data = await service.getProductDetail(objParam);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "getProductDetail" },
        { key: "Param", content: JSON.stringify(objParam) }
    ]

    await logService.accessLog(logData);
    return response.json(data)
}

async function getProductByKeiyakuno(request, response) {
    let startTime = new Date();
    let objParam = {
        KeiyakuNo: request.body.keiyaku_no
    };
    let data = await service.getProductByKeiyakuno(objParam);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "getProductByKeiyakuno" },
        { key: "Param", content: JSON.stringify(objParam) }
    ]

    await logService.accessLog(logData);
    return response.json(data)
}

async function sendKeiToSystem(request, response) {
    let startTime = new Date();
    let objParam = {
        UserNo: request.body.user_no,
        IqCustomerNo: request.body.iq_customer_no,
        lsData: request.body.list_kei,
        tokenData: request.body.tokenData
    };
    let data = await service.sendKeiToSystem(objParam);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "sendKeiToSystem" },
        { key: "Param", content: JSON.stringify(objParam) }
    ]

    await logService.accessLog(logData);
    return response.json(data)
}

async function requestOCRList(request, response) {
    let startTime = new Date();
    let objParam = {
        TaiouJoukyou: request.body.taiou_joukyou,
        FromDate: request.body.from_date,
        ToDate: request.body.to_date,
        Sort: (typeof request.body.sort === "undefined" || request.body.sort === null ? [] : request.body.sort),
        Filter: (typeof request.body.filter === "undefined" || request.body.filter === null ? [] : request.body.filter),
        Page: (typeof request.body.page === "undefined" || request.body.page === null ? 1 : request.body.page),
        PageSize: (typeof request.body.pageSize === "undefined" || request.body.pageSize === null ? 10 : request.body.pageSize)
    };
    let data = await service.requestOCRList(objParam);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "requestOCRList" },
        { key: "Param", content: JSON.stringify(objParam) }
    ]

    await logService.accessLog(logData);
    return response.json(data)
}

async function deleteOCRList(request, response) {
    let startTime = new Date();
    let objParam = {
        KeiyakuNo: request.body.keiyaku_no
    };
    let data = await service.deleteOCRList(objParam);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "deleteOCRList" },
        { key: "Param", content: JSON.stringify(objParam) }
    ]

    await logService.accessLog(logData);
    return response.json(data)
}

async function processKeiyakuAuto(request, response) {
    let startTime = new Date();
    let objParam = {
        KeiyakuInfo: request.body.keiyaku_info,
        MessageInfo: request.body.message_info,
        Type: request.body.type,
        tokenData: request.body.tokenData
    };
    let data = await service.processKeiyakuAuto(objParam);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "KeiyakuController.js" },
        { key: "Function", content: "processKeiyakuAuto" },
        { key: "Param", content: JSON.stringify(objParam) }
    ]

    await logService.accessLog(logData);
    return response.json(data)
}
//#endregion

module.exports = {
    getListKeiyaku,
    getDetailKeiyaku,
    createKeiyaku,
    updateKeiyaku,
    deleteKeiyaku,
    getKeiyakuByUser,
    getListProductByUser,
    getProductDetail,
    sendKeiToSystem,
    getProductByKeiyakuno,
    requestOCRList,
    deleteOCRList,
    processKeiyakuAuto
}