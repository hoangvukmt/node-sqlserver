'use strict';

const baseModel = require('../base/BaseModel');
const sql = baseModel.sql;
const systemConfig = require('config');
const passEncrypt = systemConfig.get('TestENV.passwordEncrypt');
const logService = require('../services/LogService');
const excelHelper = require('../util/excelHelper');

const T_Table = {
    tableName: "T_User",
    columns: [
        { key: "UserNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "LoginId", type: sql.VarChar(255), isPk: false, defaultValue: null },
        { key: "Password", type: sql.VarBinary, isPk: false, defaultValue: null },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

function fillData(user) {
    let data = {
        UserNo: null,
        LoginId: user.LoginId,
        Password: user.Password,
        CreateDate: new Date(),
        UpdateDate: new Date()
    };

    let sqlRequest = new sql.Request();
    sqlRequest.input('LoginId', sql.NVarChar, data.LoginId);
    sqlRequest.input('Password', sql.NVarChar, data.Password);
    sqlRequest.input('CreateDate', sql.DateTime, data.CreateDate);
    sqlRequest.input('UpdateDate', sql.DateTime, data.UpdateDate);
    return sqlRequest;
}

async function asyncGetUserbyLoginId(loginId) {
    let user = null;
    try{
        let sqlRequest = new sql.Request();
        sqlRequest.input('loginId', sql.VarChar, loginId);

        let sqlStr = `SELECT
         T1.UserNo
        ,T1.LoginId
        ,convert(nvarchar(MAX), DecryptByPassphrase('${passEncrypt.passPhrase}', T1.Password, 1, convert(varbinary(MAX), '${passEncrypt.expression}'))) AS Password
         FROM T_User T1 WHERE T1.LoginId = @loginId`;
        let query = new Promise(function (resolve, reject) {
            sqlRequest.query(sqlStr, (err, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            user = res.recordset[0];

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "asyncGetUserbyLoginId" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: loginId }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "asyncGetUserbyLoginId" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: loginId },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch (err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_User.js" },
            { key: "Function", content: "asyncGetUserbyLoginId" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: loginId },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return null;
    }
    return user;
}

async function asyncCreateUser(user) {
    let queryResult = null;
    try {
        let sqlRequest = fillData(user);
        let sqlStr = `INSERT INTO ${T_Table.tableName} (
            LoginId,
            Password,
            CreateDate,
            UpdateDate
        ) VALUES (
            @LoginId,
            ENCRYPTBYPASSPHRASE('${passEncrypt.passPhrase}',@Password,1,convert(varbinary(MAX), '${passEncrypt.expression}')),
            @CreateDate,
            @UpdateDate
        ) SELECT SCOPE_IDENTITY() as id`;
        let query = new Promise(function (resolve, reject) {
            sqlRequest.query(sqlStr, (err, result) => {
                if(result) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            queryResult = res.recordset.length > 0 ? res.recordset[0] : null;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "asyncCreateUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(user) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "asyncCreateUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(user) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch (err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_User.js" },
            { key: "Function", content: "asyncCreateUser" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(user) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    return queryResult;
}

async function updateUser(data) {
    return baseModel.updateById(T_Table, data);
}

async function getAllData() {
    return baseModel.getAllData(T_Table)
}
async function exportData(startTime) {
    let data = await this.getAllData();
    let result = await excelHelper.exportData(T_Table, data, startTime);
    return excelHelper.exportData(T_Table, data, startTime);
}

module.exports = {
    asyncGetUserbyLoginId,
    asyncCreateUser,
    updateUser,
    getAllData,
    exportData
}