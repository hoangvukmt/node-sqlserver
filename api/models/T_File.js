'use strict';
const baseModel = require('../base/BaseModel');
const validation = require('../util/validation');
const logService = require('../services/LogService');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_File",
    columns: [
        { key: "GroupID", type: sql.BigInt(19), isPk: false, defaultValue: null },
        { key: "FileID", type: sql.BigInt(19), isPk: false, defaultValue: null },
        { key: "ImgFileName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "JsonFileName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "MenuFileName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "DelF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getListFile(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         T1.GroupID
        ,T1.ImgFileName
        ,T1.JsonFileName
        ,T1.MenuFileName
        ,T1.DelF
        ,T1.CreateDate
        ,T1.UpdateDate
        ,T1.FileID
        ,(SELECT TOP 1 F.FileID FROM T_File F WHERE F.GroupID = T1.GroupID ORDER BY F.FileID DESC) LastFileID
        ,T2.FilePath
        ,T2.AutoF
        ,T2.Status FROM T_File T1 INNER JOIN T_Group T2 ON T1.GroupID = T2.GroupID WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.GroupID)) {
            sqlStr += ` AND T1.GroupID = @GroupID`;
        }
        sqlStr += ` AND T1.DelF = 0 ORDER BY T1.FileID`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_File.js" },
                { key: "Function", content: "getListFile" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_File.js" },
                { key: "Function", content: "getListFile" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_File.js" },
            { key: "Function", content: "getListFile" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    
    return data;
}

async function getAllFile(objSearch) {
    return baseModel.searchData(T_Table, objSearch, [{ key: "FileID", type: "ASC" }]);
}

async function getFileDetail(objSearch) {
    let data;
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    try {
        let sqlStr = `SELECT
         T1.GroupID
        ,T1.ImgFileName
        ,T1.JsonFileName
        ,T1.MenuFileName
        ,T1.DelF
        ,T1.CreateDate
        ,T1.UpdateDate
        ,T1.FileID
        ,T2.FilePath FROM T_File T1 INNER JOIN T_Group T2 ON T1.GroupID = T2.GroupID WHERE T1.GroupID = @GroupID AND T1.FileID = @FileID`;

        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if(res) {
                    resolve(res.recordset.length > 0 ? res.recordset[0] : null);
                }else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            data = res;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_File.js" },
                { key: "Function", content: "getFileDetail" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_File.js" },
                { key: "Function", content: "getFileDetail" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        })
        return data;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_File.js" },
            { key: "Function", content: "getFileDetail" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return;
    } finally {
        return data;
    }
}

async function createFile(data) {
    return baseModel.createNew(T_Table, data);
}

async function deleteFile(objSearch) {
    let objDataUpdate = {
        DelF: 1
    }
    let objCondition = {
        GroupID: objSearch.GroupID,
        FileID: objSearch.FileID
    }
    return baseModel.updateByCondition(T_Table, objDataUpdate, objCondition);
}

async function deleteGroupFile(objSearch) {
    let objDataUpdate = {
        DelF: 1,
        tokenData: objSearch.tokenData
    }
    let objCondition = {
        GroupID: objSearch.GroupID
    }
    return baseModel.updateByCondition(T_Table, objDataUpdate, objCondition);
}

//#region only kanri -------------------------------------------------------------------------------------
async function getListImage(objData) {
    let sqlRequest = baseModel.fillData(T_Table, {});
    sqlRequest.input('UserNo', sql.BigInt, objData.UserNo);
    sqlRequest.input('KeiyakuNo', sql.BigInt, objData.KeiyakuNo);
    let data;

    try {
        let sqlStr = `SELECT 
        CONCAT('[', stuff((
            SELECT CONCAT(', {"GroupID": ', T1.GroupID, ', "FileID": "', T1.FileID, '", "ImgFileName": "', T1.ImgFileName, '", "FileName": "', T2.FileName, '", "FilePath": "', T2.FilePath, '", "MenuFileName": "', T1.MenuFileName, '"}')
            FROM T_File T1 INNER JOIN T_Group T2 ON T1.GroupID = T2.GroupID
            WHERE T1.Delf = 0
            AND T1.GroupID IN (
                SELECT GroupID FROM T_Keiyaku WHERE KeiyakuNo = @KeiyakuNo
            )
            FOR XML PATH('')
        ), 1, 1,''), ']') Images,
        CONCAT('[', stuff((
            SELECT CONCAT(', {"UserNo": ', T.UserNo, ', "FileName": "', T.FileName, '", "MenuFileName": "', T.MenuFileName, '"}') 
            FROM T_FileRelation T WHERE T.UserNo = @UserNo AND T.DelF = 0
            FOR XML PATH('')
        ), 1, 1,''), ']') ImageRelation`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function (res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_File.js" },
                { key: "Function", content: "getListImage" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objData) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function (err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_File.js" },
                { key: "Function", content: "getListImage" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objData) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch (err) {
        let logData = [
            {key: "Time", content: new Date()},
            {key: "File", content: "T_File.js"},
            {key: "Function", content: "getListImage"},
            {key: "Table", content: T_Table.tableName},
            {key: "Param", content: JSON.stringify(objData)},
            {key: "Err", content: err}
        ]
        await logService.errorLog(logData);

        return false;
    }

    return data;
}

async function kanriDeleteFile(objSearch) {
    let objDataUpdate = {
        DelF: 1,
        notLog: true
    }
    let objCondition = {
        GroupID: objSearch.GroupID,
        FileID: objSearch.FileID
    }
    return baseModel.updateByCondition(T_Table, objDataUpdate, objCondition);
}
//#endregion

module.exports = {
    getListFile,
    getAllFile,
    getFileDetail,
    createFile,
    deleteFile,
    deleteGroupFile,
    getListImage,
    kanriDeleteFile
};