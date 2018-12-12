'use strict';
const baseModel = require('../base/BaseModel');
const logService = require('../services/LogService');
const validation = require('../util/validation');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_KeiyakuHosho",
    columns: [
        { key: "KeiyakuHoshoNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "KeiyakuNo", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "KeiyakuTokuyakuNo", type: sql.BigInt(8), isPk: false, defaultValue: 0 },
        { key: "HoshoNo", type: sql.BigInt(8), isPk: false, defaultValue: 0 },
        { key: "HoshoName", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "ColumnVal", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "ColumnOption", type: sql.Int(4), isPk: false, defaultValue: null },
        { key: "TypeF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "Size", type: sql.Int(4), isPk: false, defaultValue: 0 },
        { key: "SelType", type: sql.Int(4), isPk: false, defaultValue: 0 },
        { key: "SeqNo", type: sql.Int(4), isPk: false, defaultValue: 0 },
        { key: "Comment", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getListKeiyakuHosho(objSearch, orders) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         T1.KeiyakuHoshoNo
        ,T1.KeiyakuNo
        ,T1.KeiyakuTokuyakuNo
        ,T1.HoshoNo
        ,T1.HoshoName
        ,T1.ColumnVal
        ,T1.ColumnOption
        ,T1.TypeF
        ,T1.Size
        ,T1.SelType
        ,T1.SeqNo
        ,T1.Comment
        ,T1.CreateDate
        ,T1.UpdateDate
        ,T2.requiredF
        ,(
            CASE T1.TypeF
            WHEN 40 THEN (CASE ISNUMERIC(T1.ColumnVal) WHEN 1 THEN CONCAT(T4.LastName, T4.FirstName) ELSE T1.ColumnVal END)
            WHEN 70 THEN T5.AgentName
            WHEN 50 THEN T6.COMPANYNAME
            WHEN 90 THEN T7.name
            WHEN 60 THEN T8.PRODUCTNAME
            WHEN 80 THEN (CASE T1.ColumnVal WHEN NULL THEN T9.name WHEN '' THEN T9.name ELSE CONCAT(T1.ColumnVal, T9.name) END)
            ELSE T3.name END
        ) ColumnValText
         FROM T_KeiyakuHosho T1
         LEFT JOIN M_Hosho T2 ON T1.HoshoNo = T2.HoshoNo
         LEFT JOIN M_SelectItem T3 ON (T1.SelType = T3.selType AND T1.ColumnVal = convert(nvarchar(200), T3.selNo))
         LEFT JOIN T_Family T4 ON (T1.ColumnVal = convert(nvarchar(200), T4.FamilyNo))
         LEFT JOIN T_Agent T5 ON (T1.ColumnVal = convert(nvarchar(200), T5.AgentNo))
         LEFT JOIN V_Company T6 ON T1.ColumnVal = T6.COMPANYCD
         LEFT JOIN M_SelectItem T7 ON (T1.ColumnVal = convert(nvarchar(200), T7.selNo) AND T7.selType = 3)
         LEFT JOIN V_Product T8 ON (T1.ColumnVal = T8.PRODUCTCD AND T8.COMPANYCD IN (
            SELECT CompanyCd
            FROM T_Keiyaku Kei
            WHERE Kei.KeiyakuNo = T1.KeiyakuNo
         ))
         LEFT JOIN M_SelectItem T9 ON (T1.ColumnOption = T9.selNo AND T9.selType = 16)
         WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.KeiyakuNo)) {
            sqlStr += ` AND T1.KeiyakuNo = @KeiyakuNo`;
        }
        if (!validation.isEmptyObject(objSearch.KeiyakuTokuyakuNo)) {
            sqlStr += ` AND T1.KeiyakuTokuyakuNo = @KeiyakuTokuyakuNo`;
        }

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_KeiyakuHosho.js" },
                { key: "Function", content: "getListKeiyakuHosho" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_KeiyakuHosho.js" },
                { key: "Function", content: "getListKeiyakuHosho" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    }
    catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_KeiyakuHosho.js" },
            { key: "Function", content: "getListKeiyakuHosho" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    return data;
    //return baseModel.searchData(T_Table, objSearch, orders);
}

async function getDetailKeiyakuHosho(objSearch) {
    return baseModel.getDetailByID(T_Table, objSearch.KeiyakuHoshoNo);
}

async function createKeiyakuHosho(data) {
    return baseModel.createNew(T_Table, data);
}

async function updateKeiyakuHosho(data) {
    return baseModel.updateById(T_Table, data);
}

async function deleteKeiyakuHosho(data) {
    return baseModel.deleteData(T_Table, data);
}

module.exports = {
    getListKeiyakuHosho,
    getDetailKeiyakuHosho,
    createKeiyakuHosho,
    updateKeiyakuHosho,
    deleteKeiyakuHosho
}