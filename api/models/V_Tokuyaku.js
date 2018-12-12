'use strict';
const baseModel = require('../base/BaseModel');
const logService = require('../services/LogService');
const validation = require('../util/validation');

const sql = baseModel.sql;
const T_Table = {
    tableName: "V_Tokuyaku",
    columns: [
        { key: "COMPANYCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "PRODUCTCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "CATEGORYCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "TOKUNO", type: sql.Int, isPk: false, defaultValue: null },
        { key: "NAME", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "SEQNO", type: sql.Int, isPk: false, defaultValue: null },
        { key: "HoshoCategoryF", type: sql.Int, isPk: false, defaultValue: null }
    ]
};

async function getListTokuyaku(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         COMPANYCD
        ,PRODUCTCD
        ,CATEGORYCD
        ,TOKUNO
        ,NAME
        ,SEQNO
        ,HoshoCategoryF
        FROM V_Tokuyaku WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.COMPANYCD)) {
            sqlStr += ` AND (COMPANYCD = @COMPANYCD OR COMPANYCD = '99999')`;
        }
        else {
            sqlStr += ` AND COMPANYCD = '99999'`;
        }

        if (!validation.isEmptyObject(objSearch.PRODUCTCD)) {
            sqlStr += ` AND (PRODUCTCD = @PRODUCTCD OR PRODUCTCD = '99999')`;
        }
        else {
            sqlStr += ` AND PRODUCTCD = '99999'`;
        }
        
        if (!validation.isEmptyObject(objSearch.CATEGORYCD)) {
            sqlStr += ` AND (CATEGORYCD = @CATEGORYCD OR CATEGORYCD = '99999')`;
        }
        else {
            sqlStr += ` AND CATEGORYCD = '99999'`;
        }

        if (!validation.isEmptyObject(objSearch.HoshoCategoryF)) {
            sqlStr += ` AND (HoshoCategoryF = @HoshoCategoryF OR HoshoCategoryF = 0)`;
        }

        sqlStr += ` ORDER BY TOKUNO`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "V_Tokuyaku.js" },
                { key: "Function", content: "getListTokuyaku" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "V_Tokuyaku.js" },
                { key: "Function", content: "getListTokuyaku" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "V_Tokuyaku.js" },
            { key: "Function", content: "getListTokuyaku" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }

    return data;
    //return baseModel.searchData(T_Table, objSearch, [{ key: "SEQNO", type: "ASC" }]);
}

module.exports = {
    getListTokuyaku
}