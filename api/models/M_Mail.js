'use strict';
const DB = require('../util/db_util');
const sql = DB.sql;
const table_name = 'M_Mail';
const logService = require('../services/LogService');

async function asyncGetMail(mailNo) {
    let mailInfo = null;
    try {
        let sqlRequest = new sql.Request();
        sqlRequest.input('mailNo', sql.BigInt, mailNo);

        let sqlStr = `SELECT * FROM ${table_name} WHERE MailNo = @mailNo`;
        let query = new Promise(function(resolve, reject){
            sqlRequest.query(sqlStr, function(err, result){
                if (result) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            mailInfo = res.recordset[0];

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "M_Mail.js" },
                { key: "Function", content: "asyncGetMail" },
                { key: "Sql", content: sqlStr },
                { key: "Param", mailNo }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "M_Mail.js" },
                { key: "Function", content: "asyncGetMail" },
                { key: "Sql", content: sqlStr },
                { key: "Param", mailNo },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch (err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "M_Mail.js" },
            { key: "Function", content: "asyncGetMail" },
            { key: "Table", content: table_name },
            { key: "Param", content: mailNo },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return null;
    }
    return mailInfo; 
}

module.exports = {
    asyncGetMail,
}