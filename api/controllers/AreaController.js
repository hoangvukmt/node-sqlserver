const service = require('../services/AreaService');
const logService = require('../services/LogService');

async function createArea(request, response) {
    let startTime = new Date();
    let data = {
        GroupID: request.body.group_id,
        FileID: request.body.file_id,
        UpLeftX: request.body.upLeft_x,
        UpLeftY: request.body.upLeft_y,
        UpRightX: request.body.upRight_x,
        UpRightY: request.body.upRight_y,
        BottomLeftX: request.body.bottomLeft_x,
        BottomLeftY: request.body.bottomLeft_y,
        BottomRightX: request.body.bottomRight_x,
        BottomRightY: request.body.bottomRight_y,
        Rotate: request.body.rotate,
        tokenData: request.body.tokenData
    };
    let result = await service.createArea(data);
    let endTime = new Date();
    let logData = [
        { key: "Start time", content: startTime },
        { key: "End time", content: endTime },
        { key: "File", content: "AreaController.js" },
        { key: "Function", content: "createArea" },
        { key: "Param", content: JSON.stringify(data) },
        { key: "Result", content: JSON.stringify(result) }
    ]
    await logService.accessLog(logData);

    return response.json(result);
}

module.exports = {
    createArea
}