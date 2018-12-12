const UserService = require('../services/UserService');
const logService = require('../services/LogService');

async function login(request, response) {
    let startTime = new Date();
    let loginUser = {
        LoginId: request.body.login_id,
        Password: request.body.password
    }
    let result = await UserService.login(loginUser);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "login" }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function registerNewUser(request, response) {
    let startTime = new Date();
    let userinfo = {
        email: request.body.email,
        agentCd: request.body.agentCd
    }
    let result = await UserService.registerNewUser(userinfo);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "registerNewUser" },
        { key: "Param", content: JSON.stringify(userinfo) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function resetPassword(request, response) {
    let startTime = new Date();
    let email = request.body.email;
    let result = await UserService.asyncResetPassword(email);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "resetPassword" },
        { key: "Param", content: JSON.stringify(request.body) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function changePassword(request, response) {
    let startTime = new Date();
    let objData = {
        oldPass: request.body.old_password,
        newPass: request.body.new_password,
        tokenData: request.body.tokenData
    }
    let result = await UserService.changePassword(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "changePassword" },
        { key: "Param", content: JSON.stringify(objData) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function hideDialog(request, response) {
    let startTime = new Date();
    let objData = {
        HokenShokenF: request.body.hoken_shoken_f,
        UserNo: request.body.tokenData.user_no,
        tokenData: request.body.tokenData
    }
    let result = await UserService.asyncHideDialog(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "hideDialog" },
        { key: "Param", content: JSON.stringify(objData) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

//#region only kanri -------------------------------------------------------------------------------------
async function kanriLogin(request, response) {
    let startTime = new Date();
    let objData = {
        LoginId: request.body.login_id,
        Password: request.body.password
    }
    let result = await UserService.kanriLogin(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "kanriLogin" }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function searchCustomer(request, response) {
    let startTime = new Date();
    let objSearch = {
        FullName: request.body.full_name,
        Email: request.body.email,
        FromDate: request.body.from_date,
        ToDate: request.body.to_date,
        AgentCd: request.body.agent_cd,
        KaniShindanFilter: request.body.kani_shindan_filter,
        ShokenBunsekiFilter: request.body.shoken_bunseki_filter,
        Sort: (typeof request.body.sort === "undefined" || request.body.sort === null ? [] : request.body.sort),
        Filter: (typeof request.body.filter === "undefined" || request.body.filter === null ? [] : request.body.filter),
        Page: (typeof request.body.page === "undefined" || request.body.page === null ? 1 : request.body.page),
        PageSize: (typeof request.body.pageSize === "undefined" || request.body.pageSize === null ? 10 : request.body.pageSize)
    };
    let data = await UserService.searchCustomer(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "searchCustomer" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getUserInfo(request, response) {
    let startTime = new Date();
    let objData = {
        LoginId: request.body.tokenData.login_id,
        Url: request.body.url
    };
    let data = await UserService.getUserInfo(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "getUserInfo" },
        { key: "Param", content: JSON.stringify(objData) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function updateCustomer(request, response) {
    let startTime = new Date();
    let objData = {
        UserNo: request.body.user_no,
        Memo: request.body.memo
    };
    let data = await UserService.updateCustomer(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "updateCustomer" },
        { key: "Param", content: JSON.stringify(objData) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function deleteCustomer(request, response) {
    let startTime = new Date();
    let objData = {
        UserNo: request.body.user_no
    };
    let data = await UserService.deleteCustomer(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "deleteCustomer" },
        { key: "Param", content: JSON.stringify(objData) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function searchTargetCustomer(request, response) {
    let startTime = new Date();
    let objSearch = {
        TargetSex: request.body.target_sex,
        Marriage: request.body.marriage_f,
        Haschild: request.body.haschild_f,
        TargetAge: request.body.target_age,
        Kanyushite: request.body.kanyushite_f,
        KanyuHoshoCategory: request.body.kanyuhoshocategory_f,
        Kanyu: request.body.kanyu_f,
        Kikan: request.body.kikan_f,
        KikanDays: request.body.kikan_days
    };
    let data = await UserService.searchTargetCustomer(objSearch);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "searchTargetCustomer" },
        { key: "Param", content: JSON.stringify(objSearch) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}

async function getCustomerInfo(request, response) {
    let startTime = new Date();
    let objData = {
        UserNo: request.body.user_no
    };
    let data = await UserService.getCustomerInfo(objData);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "getCustomerInfo" },
        { key: "Param", content: JSON.stringify(objData) }
    ]
    await logService.accessLog(logData);

    return response.json(data);
}
//#endregion

module.exports = {
    login,
    registerNewUser,
    resetPassword,
    hideDialog,
    changePassword,
    kanriLogin,
    searchCustomer,
    getUserInfo,
    updateCustomer,
    deleteCustomer,
    searchTargetCustomer,
    getCustomerInfo
}