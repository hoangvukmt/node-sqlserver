'use strict';
const baseModel = require('../base/BaseModel');
const validation = require('../util/validation');
const logService = require('../services/LogService');

const sql = baseModel.sql;
const T_Table = {
    tableName: "M_Banner",
    columns: [
        { key: "BannerNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "BannerImgPath", type: sql.VarChar(100), isPk: false, defaultValue: null },
        { key: "BannerF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "BannerMoveUrl", type: sql.VarChar(100), isPk: false, defaultValue: null },
        { key: "DelF", type: sql.Bit(1), isPk: false, defaultValue: 0 },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getListBanner(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);

    if (!validation.isEmptyObject(objSearch.UserNo)) {
        sqlRequest.input("UserNo", sql.BigInt(8), objSearch.UserNo);
    }
    if (!validation.isEmptyObject(objSearch.DispId)) {
        sqlRequest.input("DispId", sql.Char(5), objSearch.DispId);
    }
    if (!validation.isEmptyObject(objSearch.AgentCd)) {
        sqlRequest.input("AgentCd", sql.Char(5), objSearch.AgentCd);
    }
    
    let data;
    try {
        let sqlStr = `SELECT
         T1.BannerNo
        ,T1.BannerImgPath
        ,T1.BannerF
        ,T1.BannerMoveUrl
        ,T1.DelF
        ,T1.UpdateDate
        ,T2.DispId
        ,T2.AgentCd
        ,T2.Seconds
        ,T2.SeqNo FROM M_Banner T1 INNER JOIN M_BannerCategory T2 ON T1.BannerNo = T2.BannerNo WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.BannerNo)) {
            sqlStr += ` AND T1.BannerNo = @BannerNo`;
        }
        if (!validation.isEmptyObject(objSearch.BannerF)) {
            sqlStr += ` AND T1.BannerF = @BannerF`;
        }
        if (!validation.isEmptyObject(objSearch.DispId)) {
            sqlStr += ` AND (T2.DispId = @DispId OR T2.DispId = 'ALL99')`;
        }
        else {
            sqlStr += ` AND T2.DispId = 'ALL99'`;
        }
        if (!validation.isEmptyObject(objSearch.AgentCd)) {
            sqlStr += ` AND (T2.AgentCd = @AgentCd OR T2.AgentCd = 'ALL99')`;
        }
        else {
            sqlStr += ` AND T2.AgentCd = 'ALL99'`;
        }
        if (!validation.isEmptyObject(objSearch.UserNo)) {
            sqlStr += ` AND ((T1.BannerF != 1 AND T1.BannerF != 2) OR (T1.BannerF = 1 AND (
                SELECT COUNT(*) FROM T_Keiyaku k INNER JOIN T_Family f ON (k.FamilyNo = f.FamilyNo AND f.UserNo = @UserNo) WHERE k.KaniShindanF = 0
            ) > 0))`;
            sqlStr += ` AND ((T1.BannerF != 1 AND T1.BannerF != 2) OR (T1.BannerF = 2 AND (
                SELECT COUNT(*) FROM T_Keiyaku k INNER JOIN T_Family f ON (k.FamilyNo = f.FamilyNo AND f.UserNo = @UserNo) WHERE k.ShokenBunsekiF = 1
            ) = 0))`;
        }
        
        sqlStr += ` AND T1.DelF = 0 ORDER BY T2.SeqNo`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "M_Banner.js" },
                { key: "Function", content: "getListBanner" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "M_Banner.js" },
                { key: "Function", content: "getListBanner" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "M_Banner.js" },
            { key: "Function", content: "getListBanner" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);
        
        return false;
    }
    
    return data;
}

module.exports = {
    getListBanner
}