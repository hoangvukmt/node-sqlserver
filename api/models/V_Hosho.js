'use strict';
const baseModel = require('../base/BaseModel');
const logService = require('../services/LogService');
const validation = require('../util/validation');

const sql = baseModel.sql;
const T_Table = {
    tableName: "V_Hosho",
    columns: [
        { key: "COMPANYCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "PRODUCTCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "CATEGORYCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "HoshoNo", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "HoshoCategoryF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "HoshoName", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "TypeF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "Size", type: sql.Int, isPk: false, defaultValue: null },
        { key: "SelType", type: sql.Int, isPk: false, defaultValue: null },
        { key: "SeqNo", type: sql.Int, isPk: false, defaultValue: null },
        { key: "DispF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "requiredF", type: sql.TinyInt, isPk: false, defaultValue: 0 },
        { key: "HoshoDispF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "requiredF", type: sql.TinyInt, isPk: false, defaultValue: 0 }
    ]
};

async function getListHosho(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         COMPANYCD
        ,PRODUCTCD
        ,CATEGORYCD
        ,HoshoNo
        ,HoshoCategoryF
        ,HoshoName
        ,TypeF
        ,Size
        ,SelType
        ,SeqNo
        ,DispF
        ,HoshoDispF
        ,requiredF FROM V_Hosho WHERE 1 = 1`;

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
        
        if (!validation.isEmptyObject(objSearch.HoshoCategoryF)) {
            sqlStr += ` AND (HoshoCategoryF = @HoshoCategoryF OR HoshoCategoryF = 0)`;
        }
        else {
            sqlStr += ` AND HoshoCategoryF = 0`;
        }

        if (!validation.isEmptyObject(objSearch.Type)) {
            if (objSearch.Type === "SHU") {
                sqlStr += ` AND (HoshoDispF = 0 OR HoshoDispF = 1)`;
            }
            else if (objSearch.Type === "TO") {
                sqlStr += ` AND (HoshoDispF = 0 OR HoshoDispF = 2)`;
            }
        }

        sqlStr += ` ORDER BY SeqNo`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "V_Hosho.js" },
                { key: "Function", content: "getListHosho" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "V_Hosho.js" },
                { key: "Function", content: "getListHosho" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "V_Hosho.js" },
            { key: "Function", content: "getListHosho" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }

    return data;
    //return baseModel.searchData(T_Table, objSearch, [{ key: "SeqNo", type: "ASC" }]);
}

async function getListTokuyakuHosho(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         COMPANYCD
        ,PRODUCTCD
        ,CATEGORYCD
        ,HoshoNo
        ,HoshoCategoryF
        ,HoshoName
        ,TypeF
        ,Size
        ,SelType
        ,SeqNo
        ,DispF
        ,requiredF FROM V_Hosho WHERE CATEGORYCD IN (
            SELECT CATEGORYCD FROM V_Tokuyaku
        ) AND COMPANYCD = @COMPANYCD AND PRODUCTCD = @PRODUCTCD AND CATEGORYCD = @CATEGORYCD`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "V_Hosho.js" },
                { key: "Function", content: "getListTokuyakuHosho" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "V_Hosho.js" },
                { key: "Function", content: "getListTokuyakuHosho" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "V_Hosho.js" },
            { key: "Function", content: "getListTokuyakuHosho" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    
    return data;
}

async function getListKeiyakuHosho(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         COMPANYCD
        ,PRODUCTCD
        ,CATEGORYCD
        ,HoshoNo
        ,HoshoCategoryF
        ,HoshoName
        ,TypeF
        ,Size
        ,SelType
        ,SeqNo
        ,DispF
        ,requiredF FROM V_Hosho
         WHERE 1 = 1 AND (HoshoCategoryF = @HoshoCategoryF OR HoshoCategoryF = 0) AND DispF = 0
         ORDER BY SeqNo`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "V_Hosho.js" },
                { key: "Function", content: "getListKeiyakuHosho" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "V_Hosho.js" },
                { key: "Function", content: "getListKeiyakuHosho" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "V_Hosho.js" },
            { key: "Function", content: "getListKeiyakuHosho" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }

    return data;
    //return baseModel.searchData(T_Table, objSearch, [{ key: "SeqNo", type: "ASC" }]);
}

module.exports = {
    getListHosho,
    getListTokuyakuHosho,
    getListKeiyakuHosho
}