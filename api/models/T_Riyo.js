'use strict';
const baseModel = require('../base/BaseModel');
const validation = require('../util/validation');

const sql = baseModel.sql;

const logService = require('../services/LogService');

const T_Riyo_ActionContent = {
    HokenBunseki_Kaishi: '保険分析サービス開始',
    Login: 'ログイン',
    ChangePass: 'パスワード更新',
    ReSendPass: 'パスワード忘れ依頼',
    RegistFamily: '家族情報登録',
    InsertFamily: '家族情報追加',
    ChangeFamily: '家族情報更新',
    DeleteFamily: '家族情報削除',
    RequestInquiry: 'お問合せ依頼',
    RequestDiagnostic: '簡易診断依頼',
    RequestTrailAnalysis: 'お試し分析依頼',
    RequestAutoInput: '保険証券自動入力依頼',
    AddHoken: '保険証券登録',
    ChangeHoken: '保険証券更新',
    DeleteHoken: '保険証券削除',
    AddHokenImage: '保険証券画像追加',
    ClickBaner: 'バナー呼出「<バナーNo>」',
    AddAgent: '保険代理店登録',
    ChangeAgent: '保険代理店更新',
    DeleteAgent: '保険代理店削除'
}
const T_Table = {
    tableName: "T_Riyo",
    columns: [
        { key: "RiyoNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "UserNo", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "ActionCode", type: sql.TinyInt, isPk: false, defaultValue: 0 },
        { key: "ActionContent", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
}
const fieldWhiteList = [
    "CreateDate",
    "ActionContent"
];

async function asyncCreateRiyo(riyo) {
    let sqlRequest = baseModel.fillData(T_Table, riyo);
    let query = new Promise(function(resolve, reject){
        try {
            sqlRequest.query(`INSERT INTO ${T_Table.tableName} (UserNo, ActionContent) VALUES
            (
                @UserNo,
                @ActionContent
            )`, function(err, result){
                if(result){
                    resolve(result);
                }else {
                    reject(err);
                    query = err;
                }
            });
        }catch(err) {
            return (err);
        }
    });
    return query;
}

//#region only kanri -------------------------------------------------------------------------------------
async function searchRiyo(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let yearFrom = 1;
    let monthFrom = 1;
    let monthTo = 1;

    if (!validation.isEmptyObject(objSearch.Login)) {
        if (objSearch.Login.indexOf(",0,") >= 0){
            sqlRequest.input("HokenBunseki_Kaishi", sql.NVarChar(200), T_Riyo_ActionContent.HokenBunseki_Kaishi);
        }
        if (objSearch.Login.indexOf(",1,") >= 0){
            sqlRequest.input("Login", sql.NVarChar(200), T_Riyo_ActionContent.Login);
        }
        if (objSearch.Login.indexOf(",2,") >= 0){
            sqlRequest.input("ChangePass", sql.NVarChar(200), T_Riyo_ActionContent.ChangePass);
        }
    }
    if (!validation.isEmptyObject(objSearch.KazokuJouhou)) {
        if (objSearch.KazokuJouhou.indexOf(",0,") >= 0){
            sqlRequest.input("RegistFamily", sql.NVarChar(200), T_Riyo_ActionContent.RegistFamily);
        }
        if (objSearch.KazokuJouhou.indexOf(",1,") >= 0){
            sqlRequest.input("InsertFamily", sql.NVarChar(200), T_Riyo_ActionContent.InsertFamily);
        }
        if (objSearch.KazokuJouhou.indexOf(",2,") >= 0){
            sqlRequest.input("ChangeFamily", sql.NVarChar(200), T_Riyo_ActionContent.ChangeFamily);
        }
        if (objSearch.KazokuJouhou.indexOf(",3,") >= 0){
            sqlRequest.input("DeleteFamily", sql.NVarChar(200), T_Riyo_ActionContent.DeleteFamily);
        }
    }
    if (!validation.isEmptyObject(objSearch.Irai)) {
        if (objSearch.Irai.indexOf(",0,") >= 0){
            sqlRequest.input("RequestInquiry", sql.NVarChar(200), T_Riyo_ActionContent.RequestInquiry);
        }
        if (objSearch.Irai.indexOf(",1,") >= 0){
            sqlRequest.input("RequestDiagnostic", sql.NVarChar(200), T_Riyo_ActionContent.RequestDiagnostic);
        }
        if (objSearch.Irai.indexOf(",2,") >= 0){
            sqlRequest.input("RequestTrailAnalysis", sql.NVarChar(200), T_Riyo_ActionContent.RequestTrailAnalysis);
        }
        if (objSearch.Irai.indexOf(",3,") >= 0){
            sqlRequest.input("ReSendPass", sql.NVarChar(200), T_Riyo_ActionContent.ReSendPass);
        }
        if (objSearch.Irai.indexOf(",4,") >= 0){
            sqlRequest.input("RequestAutoInput", sql.NVarChar(200), T_Riyo_ActionContent.RequestAutoInput);
        }
    }
    if (!validation.isEmptyObject(objSearch.HokenShouken)) {
        if (objSearch.HokenShouken.indexOf(",0,") >= 0){
            sqlRequest.input("AddHoken", sql.NVarChar(200), T_Riyo_ActionContent.AddHoken);
        }
        if (objSearch.HokenShouken.indexOf(",1,") >= 0){
            sqlRequest.input("ChangeHoken", sql.NVarChar(200), T_Riyo_ActionContent.ChangeHoken);
        }
        if (objSearch.HokenShouken.indexOf(",2,") >= 0){
            sqlRequest.input("DeleteHoken", sql.NVarChar(200), T_Riyo_ActionContent.DeleteHoken);
        }
        if (objSearch.HokenShouken.indexOf(",3,") >= 0){
            sqlRequest.input("AddHokenImage", sql.NVarChar(200), T_Riyo_ActionContent.AddHokenImage);
        }
    }
    if (!validation.isEmptyObject(objSearch.HokenDairiten)) {
        if (objSearch.HokenDairiten.indexOf(",0,") >= 0){
            sqlRequest.input("AddAgent", sql.NVarChar(200), T_Riyo_ActionContent.AddAgent);
        }
        if (objSearch.HokenDairiten.indexOf(",1,") >= 0){
            sqlRequest.input("ChangeAgent", sql.NVarChar(200), T_Riyo_ActionContent.ChangeAgent);
        }
        if (objSearch.HokenDairiten.indexOf(",2,") >= 0){
            sqlRequest.input("DeleteAgent", sql.NVarChar(200), T_Riyo_ActionContent.DeleteAgent);
        }
    }
    if (!validation.isEmptyObject(objSearch.Baner)) {
        if (objSearch.Baner.indexOf(",0,") >= 0){
            sqlRequest.input("ClickBaner", sql.NVarChar(200), T_Riyo_ActionContent.ClickBaner);
        }
    }

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
         RiyoNo
        ,UserNo
        ,ActionContent
        ,CreateDate
        ,UpdateDate        
         FROM T_Riyo
         WHERE UserNo = @UserNo`;

        if (!validation.isEmptyObject(objSearch.Login)) {
            let strLogin = "";
            let bvar=(sqlStr.indexOf(" AND ") === -1);
            if (objSearch.Login.indexOf(",0,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @HokenBunseki_Kaishi`;
                }
                else {
                    strLogin += ` OR ActionContent = @HokenBunseki_Kaishi`;
                }
            }
            if (objSearch.Login.indexOf(",1,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @Login`;
                }
                else {
                    strLogin += ` OR ActionContent = @Login`;
                }
            }
            if (objSearch.Login.indexOf(",2,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @ChangePass`;
                }
                else {
                    strLogin += ` OR ActionContent = @ChangePass`;
                }
            }
            sqlStr += strLogin;
        }
        if (!validation.isEmptyObject(objSearch.KazokuJouhou)) {
            let strLogin = "";
            let bvar=(sqlStr.indexOf(" AND ") === -1);
            if (objSearch.KazokuJouhou.indexOf(",0,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @RegistFamily`;
                }
                else {
                    strLogin += ` OR ActionContent = @RegistFamily`;
                }
            }
            if (objSearch.KazokuJouhou.indexOf(",1,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @InsertFamily`;
                }
                else {
                    strLogin += ` OR ActionContent = @InsertFamily`;
                }
            }
            if (objSearch.KazokuJouhou.indexOf(",2,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @ChangeFamily`;
                }
                else {
                    strLogin += ` OR ActionContent = @ChangeFamily`;
                }
            }
            if (objSearch.KazokuJouhou.indexOf(",3,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @DeleteFamily`;
                }
                else {
                    strLogin += ` OR ActionContent = @DeleteFamily`;
                }
            }
            sqlStr += strLogin;
        }        
        if (!validation.isEmptyObject(objSearch.Irai)) {
            let strLogin = "";
            let bvar=(sqlStr.indexOf(" AND ") === -1);
            if (objSearch.Irai.indexOf(",0,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @RequestInquiry`;
                }
                else {
                    strLogin += ` OR ActionContent = @RequestInquiry`;
                }
            }
            if (objSearch.Irai.indexOf(",1,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @RequestDiagnostic`;
                }
                else {
                    strLogin += ` OR ActionContent = @RequestDiagnostic`;
                }
            }
            if (objSearch.Irai.indexOf(",2,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @RequestTrailAnalysis`;
                }
                else {
                    strLogin += ` OR ActionContent = @RequestTrailAnalysis`;
                }
            }
            if (objSearch.Irai.indexOf(",3,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @ReSendPass`;
                }
                else {
                    strLogin += ` OR ActionContent = @ReSendPass`;
                }
            }
            if (objSearch.Irai.indexOf(",4,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @RequestAutoInput`;
                }
                else {
                    strLogin += ` OR ActionContent = @RequestAutoInput`;
                }
            }
            
            sqlStr += strLogin;
        }
        if (!validation.isEmptyObject(objSearch.HokenShouken)) {
            let strLogin = "";
            let bvar=(sqlStr.indexOf(" AND ") === -1);
            if (objSearch.HokenShouken.indexOf(",0,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @AddHoken`;
                }
                else {
                    strLogin += ` OR ActionContent = @AddHoken`;
                }
            }
            if (objSearch.HokenShouken.indexOf(",1,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @ChangeHoken`;
                }
                else {
                    strLogin += ` OR ActionContent = @ChangeHoken`;
                }
            }
            if (objSearch.HokenShouken.indexOf(",2,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @DeleteHoken`;
                }
                else {
                    strLogin += ` OR ActionContent = @DeleteHoken`;
                }
            }
            if (objSearch.HokenShouken.indexOf(",3,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @AddHokenImage`;
                }
                else {
                    strLogin += ` OR ActionContent = @AddHokenImage`;
                }
            }
            
            sqlStr += strLogin;
        }
        if (!validation.isEmptyObject(objSearch.HokenDairiten)) {
            let strLogin = "";
            let bvar=(sqlStr.indexOf(" AND ") === -1);
            if (objSearch.HokenDairiten.indexOf(",0,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @AddAgent`;
                }
                else {
                    strLogin += ` OR ActionContent = @AddAgent`;
                }
            }
            if (objSearch.HokenDairiten.indexOf(",1,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @ChangeAgent`;
                }
                else {
                    strLogin += ` OR ActionContent = @ChangeAgent`;
                }
            }
            if (objSearch.HokenDairiten.indexOf(",2,") >= 0){
                if (strLogin === "" && bvar) {
                    strLogin += ` AND (ActionContent = @DeleteAgent`;
                }
                else {
                    strLogin += ` OR ActionContent = @DeleteAgent`;
                }
            }
            
            sqlStr += strLogin;
        }        
        if (!validation.isEmptyObject(objSearch.Baner)) {
            if (objSearch.Baner.indexOf(",0,") >= 0){                
                sqlStr += ` OR ActionContent = @ClickBaner`;
            }
        }
        if (sqlStr.indexOf(" (") != -1) {
            sqlStr+=")"
        }

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

        let orderStr = await baseModel.buildOrder(objSearch, fieldWhiteList, `CreateDate`);
        let strFilter = await baseModel.buildFilter(objSearch, fieldWhiteList, sqlRequest);

        let sqlCount = `SELECT COUNT(A.RiyoNo) row_count FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter + ";"
        sqlStr = `WITH query AS (SELECT ROW_NUMBER() OVER(` + orderStr + `) AS line, * FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter +`) SELECT TOP (@PageSize) * FROM query WHERE line > (@Page - 1) * @PageSize;`;
        sqlStr += sqlCount;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            dataReturn = res.recordsets[0];
            totalRecord = res.recordsets[1][0].row_count;
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Riyo.js" },
                { key: "Function", content: "searchRiyo" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Riyo.js" },
                { key: "Function", content: "searchRiyo" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Riyo.js" },
            { key: "Function", content: "searchRiyo" },
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
//#endregion

module.exports = {
    T_Riyo_ActionContent,
    asyncCreateRiyo,
    searchRiyo
}