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

async function create(request, response) {
    let startTime = new Date();
    let createUser = {
        LoginId: request.body.login_id,
        Password: request.body.password
    }
    let result = await UserService.create(createUser);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "create" }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function updateById(request, response) {
    let startTime = new Date();
    let updateUser = {
        LoginId: request.body.login_id,
        Password: request.body.password,
        UserNo: request.body.user_no
    }
    let result = await UserService.updateById(updateUser);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "update" }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

async function exportData(request, response) {
    let startTime = new Date();
    let result = await UserService.exportData(startTime);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "UserController.js" },
        { key: "Function", content: "update" }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

module.exports = {
    login,
    create,
    updateById, 
    exportData
}