'use strict';
const baseModel = require('../base/BaseModel');
const validation = require('../util/validation');
const logService = require('../services/LogService');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_HaishinLog",
    columns: [
        { key: "HaishinID", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "TargetF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "TargetSex", type: sql.Char, isPk: false, defaultValue: null },
        { key: "MarriageF", type: sql.Char, isPk: false, defaultValue: 0 },
        { key: "HasChildF", type: sql.Char, isPk: false, defaultValue: null },
        { key: "TargetAge", type: sql.Char, isPk: false, defaultValue: null },
        { key: "KanyuShiteiF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "KanyuF", type: sql.Bit, isPk: false, defaultValue: null },
        { key: "KanyuHoshoCategoryF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "KikanF", type: sql.Char(1), isPk: false, defaultValue: null },
        { key: "KikanDays", type: sql.NVarChar(4), isPk: false, defaultValue: null },
        { key: "TargetCount", type: sql.NVarChar(8), isPk: false, defaultValue: null },
        { key: "MessageTitle", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "Message", type: sql.NVarChar(4000), isPk: false, defaultValue: null },
        { key: "GroupID", type: sql.BigInt, isPk: false, defaultValue: null },
        { key: "TantoName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};
const fieldWhiteList = [
    "MessageTitle",
    "KikanF",
    "CreateDate",
    "KikanFName",
    "TargetF"
];

//#region only kanri -------------------------------------------------------------------------------------
async function searchHaishinLog(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let yearFrom = 1;
    let monthFrom = 1;
    let monthTo = 1;

    if (!validation.isEmptyObject(objSearch.FromDate)) {
        if (!validation.isEmptyObject(objSearch.ToDate)) {
            let arrFromDate = objSearch.FromDate.split('-');
            let arrToDate = objSearch.ToDate.split('-');
            if (arrFromDate[0] === arrToDate[0] && arrFromDate[0] === '9000') {
                monthFrom = parseInt(arrFromDate[1]);
                sqlRequest.input("monthFrom", sql.Int, monthFrom);
                monthTo = parseInt(arrToDate[1]);
                sqlRequest.input("monthTo", sql.Int, monthTo);
            }
            else if (arrFromDate[0] === '9000' && arrToDate[0] !== '9000') {
                yearFrom = parseInt(arrToDate[0]);
                sqlRequest.input("yearFrom", sql.Int, yearFrom);
                monthFrom = parseInt(arrFromDate[1]);
                sqlRequest.input("monthFrom", sql.Int, monthFrom);
            }
        }
        sqlRequest.input("FromDate", sql.DateTime, new Date(objSearch.FromDate));
    }
    if (!validation.isEmptyObject(objSearch.ToDate)) {
        sqlRequest.input("ToDate", sql.DateTime, new Date(objSearch.ToDate));
    }        

    sqlRequest.input("Page", sql.Int, parseInt(objSearch.Page));
    sqlRequest.input("PageSize", sql.Int, parseInt(objSearch.PageSize));
    
    let dataReturn;
    let totalRecord = 0;
    try {
        let sqlStr = `SELECT
         HaishinID
        ,TargetF
        ,TargetSex
        ,MarriageF
        ,HasChildF
        ,TargetAge
        ,KanyuShiteiF
        ,KanyuF
        ,KanyuHoshoCategoryF
        ,KikanF
        ,(
            CASE KikanF
                WHEN 0 THEN N'すべて'
                WHEN 2 THEN (
                    CASE KikanDays
                        WHEN NULL THEN N'日間起動していないユーザー'
                        ELSE CONCAT(KikanDays, ' 日間起動していないユーザー')
                    END
                )
                ELSE (
                    CASE KikanDays
                        WHEN NULL THEN N'日以内に起動したユーザー'
                        ELSE CONCAT(KikanDays, ' 日以内に起動したユーザー')
                    END
                )
            END
        ) KikanFName
        ,KikanDays
        ,TargetCount
        ,MessageTitle
        ,Message
        ,GroupID
        ,TantoName
        ,CreateDate
        ,UpdateDate
         FROM T_HaishinLog
         WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.FromDate)) {
            if (!validation.isEmptyObject(objSearch.ToDate)) {
                let arrFromDate = objSearch.FromDate.split('-');
                let arrToDate = objSearch.ToDate.split('-');
                if (arrFromDate[0] === arrToDate[0] && arrFromDate[0] === '9000') {
                    sqlStr += ` AND DATEPART(month, UpdateDate) >= @monthFrom`;
                }
                else if (arrFromDate[0] === '9000' && arrToDate[0] !== '9000') {
                    sqlStr += ` AND (
                        (DATEPART(month, UpdateDate) >= @monthFrom AND DATEPART(year, UpdateDate) < @yearFrom) OR
                        (DATEPART(year, UpdateDate) >= @yearFrom AND DATEADD(d, 0, DATEDIFF(d, 0, UpdateDate)) <= @FromDate)
                    )`;
                }
                else {
                    sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, UpdateDate)) >= @FromDate`;
                }
            }
            else {
                sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, UpdateDate)) >= @FromDate`;
            }
        }

        if (!validation.isEmptyObject(objSearch.ToDate)) {
            if (!validation.isEmptyObject(objSearch.FromDate)) {
                let arrFromDate = objSearch.FromDate.split('-');
                let arrToDate = objSearch.ToDate.split('-');
                if (arrFromDate[0] === arrToDate[0] && arrFromDate[0] === '9000') {
                    sqlStr += ` AND DATEPART(month, UpdateDate) <= @monthTo`;
                }
                else {
                    sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, UpdateDate)) <= @ToDate`;
                }
            }
            else {
                sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, UpdateDate)) <= @ToDate`;
            }
        }

        let orderStr = await baseModel.buildOrder(objSearch, fieldWhiteList, `CreateDate DESC`);
        let strFilter = await baseModel.buildFilter(objSearch, fieldWhiteList, sqlRequest);

        let sqlCount = `SELECT COUNT(A.HaishinID) row_count FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter + ";"
        sqlStr = `WITH query AS (SELECT ROW_NUMBER() OVER(` + orderStr + `) AS line, * FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter +`) SELECT TOP (@PageSize) * FROM query WHERE line > (@Page - 1) * @PageSize;`;
        sqlStr += sqlCount;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            dataReturn = res.recordsets[0];
            totalRecord = res.recordsets[1][0].row_count;
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_HaishinLog.js" },
                { key: "Function", content: "searchHaishinLog" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_HaishinLog.js" },
                { key: "Function", content: "searchHaishinLog" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_HaishinLog.js" },
            { key: "Function", content: "searchHaishinLog" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);
        
        return false;
    }
    
    return {
        data: dataReturn,
        totalRecord: totalRecord
    };
}

async function getHaishinLogDetail (objSearch) {
    let data;
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    try {
        let sqlStr = `SELECT
         T1.HaishinID
        ,T1.TargetF
        ,T1.TargetSex
        ,T1.MarriageF
        ,T1.HasChildF
        ,T1.TargetAge
        ,T1.KanyuShiteiF
        ,T1.KanyuF
        ,T1.KanyuHoshoCategoryF
        ,T1.KikanF
        ,T1.KikanDays
        ,T1.TargetCount
        ,T1.MessageTitle
        ,T1.Message
        ,T1.GroupID
        ,T1.TantoName
        ,T1.CreateDate
        ,T1.UpdateDate
        ,T2.name KanyuHoshoCategoryName
        FROM T_HaishinLog T1 LEFT JOIN M_SelectItem T2 ON T1.KanyuHoshoCategoryF = T2.selNo AND T2.selType = 3
        WHERE T1.HaishinID = @HaishinID`;

        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if(res) {
                    resolve(res.recordset.length > 0 ? res.recordset[0] : null);
                } else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            data = res;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_HaishinLog.js" },
                { key: "Function", content: "getHaishinLogDetail" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_HaishinLog.js" },
                { key: "Function", content: "getHaishinLogDetail" },
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
            { key: "File", content: "T_HaishinLog.js" },
            { key: "Function", content: "getHaishinLogDetail" },
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

async function createHaishinlog(data) {
    return baseModel.createNew(T_Table, data);
}

//#endregion

module.exports = {
    searchHaishinLog,
    getHaishinLogDetail,
    createHaishinlog
}