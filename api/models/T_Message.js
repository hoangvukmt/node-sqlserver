'use strict';
const baseModel = require('../base/BaseModel');
const validation = require('../util/validation');
const logService = require('../services/LogService');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_Message",
    columns: [
        { key: "MessageNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "ParentMessageNo", type: sql.BigInt(8), isPk: false, defaultValue: 0 },
        { key: "UserNo", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "MessageType", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "MessageTitle", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "Message", type: sql.NVarChar(4000), isPk: false, defaultValue: null },
        { key: "IconNumber", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "TantoName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "displayedF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: 'getdate()' }
    ]
};
const fieldWhiteList = [
    "MessageTypeName",
    "MessageTitle",
    "AgentName",
    "FullName",
    "CreateDate"
];

async function getListMessage(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         T1.MessageNo
        ,T1.ParentMessageNo
        ,T1.UserNo
        ,T1.MessageType
        ,T1.MessageTitle
        ,T1.Message
        ,T1.IconNumber
        ,T1.TantoName
        ,T1.CreateDate
        ,T1.UpdateDate
        , CONCAT('[', STUFF((
            SELECT CONCAT(', {"ResultPath": "', ResultPath, '"}') 
            FROM T_ResultShokenBunseki PDF 
            WHERE T1.MessageNo = PDF.MessageNo FOR XML PATH('')), 1, 1, ''), ']') lsPdf
        , CONCAT('[', STUFF((
            SELECT CONCAT(', {"FileID": ', FileID, '}') 
            FROM T_MessageFile MF 
            WHERE T1.MessageNo = MF.MessageNo AND MF.DelF = 0 FOR XML PATH('')), 1, 1, ''), ']') lsImage
        ,T2.ResultPath
        ,T3.KaniShindanF AS UserKaniShindanF
        ,T3.ShokenBunsekiF AS UserShokenBunsekiF
         FROM T_Message T1
         LEFT JOIN T_ResultShokenBunseki T2 ON T1.MessageNo = T2.MessageNo
         INNER JOIN T_User T3 ON T1.UserNo = T3.UserNo AND T3.DelF = 0
         WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.UserNo)) {
            sqlStr += ` AND T1.UserNo = @UserNo`;
        }
        if (!validation.isEmptyObject(objSearch.MessageType)) {
            sqlStr += ` AND T1.MessageType = @MessageType`;
        }
        if (!validation.isEmptyObject(objSearch.displayedF)) {
            sqlStr += ` AND T1.displayedF = @displayedF`;
        }
        if (!validation.isEmptyObject(objSearch.ParentMessageNo)) {
            sqlStr += ` AND T1.ParentMessageNo = @ParentMessageNo`;
        }
        sqlStr += ` ORDER BY T1.CreateDate DESC`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Message.js" },
                { key: "Function", content: "getListMessage" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Message.js" },
                { key: "Function", content: "getListMessage" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Message.js" },
            { key: "Function", content: "getListMessage" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    
    return data;
}

async function getDetailMessage(objSearch) {
    return baseModel.getDetailByID(T_Table, objSearch.MessageNo);
}

async function createMessage(data) {
    return baseModel.createNewGetId(T_Table, data);
}

async function updateMessage(data) {
    return baseModel.updateById(T_Table, data);
}

async function updateMessageFlag(objSearch) {
    let objDataUpdate = {
        displayedF: 1,
        tokenData: objSearch.tokenData
    }
    let objCondition = {
        UserNo: objSearch.UserNo
    }
    return baseModel.updateByCondition(T_Table, objDataUpdate, objCondition);
}

//#region only kanri -------------------------------------------------------------------------------------
async function getMessageByIdOrUser(objParam) {
    let sqlRequest = baseModel.fillData(T_Table, {});
    sqlRequest.input('UserNo', sql.BigInt, objParam.UserNo);
    sqlRequest.input('MessageNo', sql.BigInt, objParam.MessageNo);
    let data;

    try {
        let sqlStr = `SELECT
         T1.MessageNo
        ,T1.UserNo
        ,T1.CreateDate
        ,T1.MessageType
        ,CONCAT('[', stuff((
            SELECT CONCAT(', {"MessageNo": ', MessageNo, ', "MessageType": ', MessageType, ', "MessageTitle": "', MessageTitle, '", "Message": "', Message, '", "IconNumber": ', IconNumber, ', "TantoName": "', TantoName, '", "CreateDate": "', CONVERT(VARCHAR(10), CreateDate, 111), '", "lsPdf": [', STUFF((SELECT CONCAT(', {"ResultPath": "', ResultPath, '"}') FROM T_ResultShokenBunseki PDF WHERE T.MessageNo = PDF.MessageNo FOR XML PATH('')), 1, 1, ''), '], "lsImage": [', STUFF((SELECT CONCAT(', {"FileID": ', FileID, '}') FROM T_MessageFile MF WHERE T.MessageNo = MF.MessageNo AND MF.DelF = 0 FOR XML PATH('')), 1, 1, ''), ']}')
            FROM T_Message T
            WHERE T.MessageNo = T1.MessageNo OR T.ParentMessageNo = T1.MessageNo ORDER BY T.CreateDate FOR XML PATH('')
        ), 1, 1,''), ']') Messages
        FROM T_Message T1
        WHERE (T1.ParentMessageNo = 0 OR T1.ParentMessageNo = T1.MessageNo)`;

        if (!validation.isEmptyObject(objParam.UserNo)) {
            sqlStr += ` AND T1.UserNo = @UserNo`;
        }
        if (!validation.isEmptyObject(objParam.MessageNo)) {
            sqlStr += ` AND T1.MessageNo = @MessageNo`;
        }
        sqlStr += ` ORDER BY T1.CreateDate DESC`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function (res) {
            data = res.recordset;
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Message.js" },
                { key: "Function", content: "getMessageByIdOrUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objParam) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function (err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Message.js" },
                { key: "Function", content: "getMessageByIdOrUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objParam) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch (err) {
        let logData = [
            {key: "Time", content: new Date()},
            {key: "File", content: "T_Message.js"},
            {key: "Function", content: "getMessageByIdOrUser"},
            {key: "Table", content: T_Table.tableName},
            {key: "Param", content: JSON.stringify(objParam)},
            {key: "Err", content: err}
        ]
        await logService.errorLog(logData);

        return false;
    }

    return data;
}

async function searchMessage(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let yearFrom = 1;
    let monthFrom = 1;
    let monthTo = 1;

    if (!validation.isEmptyObject(objSearch.IraiNaiyou)) {
        sqlRequest.input("IraiNaiyou", sql.NVarChar, objSearch.IraiNaiyou);
    }
    if (!validation.isEmptyObject(objSearch.TaiouJoukyou)) {
        sqlRequest.input("TaiouJoukyou", sql.NVarChar, objSearch.TaiouJoukyou);
    }
    if (!validation.isEmptyObject(objSearch.Dairiten)) {        
        sqlRequest.input("Dairiten", sql.NVarChar(200), objSearch.Dairiten);        
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
         T1.MessageNo
        ,T1.ParentMessageNo
        ,T1.UserNo
        ,T1.MessageType
        ,(CASE T1.MessageType WHEN 0 THEN N'お問い合わせ' WHEN 1 THEN N'簡易診断' WHEN 2 THEN N'お試し証券分析' END) MessageTypeName
        ,T1.MessageTitle
        ,T1.Message
        ,T1.IconNumber
        ,T1.TantoName
        ,T1.CreateDate
        ,T1.UpdateDate
        ,T2.LoginId
        ,T2.Password
        ,T2.AgentCd
        ,T2.CustomerNumber
        ,T2.HokenShokenF
        ,T2.Memo
        ,T2.IqCustomerNo
        ,T2.KaniShindanF
        ,T2.ShokenBunsekiF
        ,T3.AgentName
        ,CONCAT(CASE T4.LastName WHEN NULL THEN '' ELSE T4.LastName END, ' ', T4.FirstName) FullName
        ,T4.FamilyNo
        ,(
            select count(*)
            from T_ResultShokenBunseki T5
            where T5.MessageNo IN (
                select MessageNo
                from T_Message M
                where M.ParentMessageNo = T1.ParentMessageNo
            )
        ) countResultShokenBunseki
         FROM T_Message T1 INNER JOIN T_User T2 ON T1.UserNo = T2.UserNo
         LEFT JOIN V_Agent T3 ON T2.AgentCd = T3.AgentCd
         LEFT JOIN T_Family T4 ON T2.UserNo = T4.UserNo AND T4.Relation = 0
         WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.FromDate)) {
            if (!validation.isEmptyObject(objSearch.ToDate)) {
                let arrFromDate = objSearch.FromDate.split('-');
                let arrToDate = objSearch.ToDate.split('-');
                if (arrFromDate[0] === arrToDate[0] && arrFromDate[0] === '9000') {
                    sqlStr += ` AND DATEPART(month, T1.CreateDate) >= @monthFrom`;
                }
                else if (arrFromDate[0] === '9000' && arrToDate[0] !== '9000') {
                    sqlStr += ` AND (
                        (DATEPART(month, T1.CreateDate) >= @monthFrom AND DATEPART(year, T1.CreateDate) < @yearFrom) OR
                        (DATEPART(year, T1.CreateDate) >= @yearFrom AND DATEADD(d, 0, DATEDIFF(d, 0, T1.CreateDate)) <= @FromDate)
                    )`;
                }
                else {
                    sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, T1.CreateDate)) >= @FromDate`;
                }
            }
            else {
                sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, T1.CreateDate)) >= @FromDate`;
            }
        }

        if (!validation.isEmptyObject(objSearch.ToDate)) {
            if (!validation.isEmptyObject(objSearch.FromDate)) {
                let arrFromDate = objSearch.FromDate.split('-');
                let arrToDate = objSearch.ToDate.split('-');
                if (arrFromDate[0] === arrToDate[0] && arrFromDate[0] === '9000') {
                    sqlStr += ` AND DATEPART(month, T1.CreateDate) <= @monthTo`;
                }
                else {
                    sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, T1.CreateDate)) <= @ToDate`;
                }
            }
            else {
                sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, T1.CreateDate)) <= @ToDate`;
            }
        }
        
        if (!validation.isEmptyObject(objSearch.IraiNaiyou)) {
            sqlStr += ` AND CHARINDEX(CONCAT(',', T1.MessageType, ','), @IraiNaiyou) > 0`;
        }
        if (!validation.isEmptyObject(objSearch.TaiouJoukyou)) {
            let strtmp = '';
            if (objSearch.TaiouJoukyou.indexOf(',0,') >= 0) {
                strtmp += ' AND (T1.ParentMessageNo=0'
            }
            if (objSearch.TaiouJoukyou.indexOf(',1,') >= 0) {
                if (strtmp != '') {
                    strtmp += ' OR T1.ParentMessageNo=T1.MessageNo)'
                }
                else {
                    strtmp +=  ' AND T1.ParentMessageNo=T1.MessageNo'
                }
            }
            if ((strtmp.indexOf('(') >= 0) && (strtmp.indexOf(')') == -1)) {
                strtmp += ')';
            }
            sqlStr += strtmp;
        }
        if (!validation.isEmptyObject(objSearch.Dairiten)) {        
            sqlStr += ` AND T2.AgentCd = @Dairiten`;
        }        
        let orderStr = await baseModel.buildOrder(objSearch, fieldWhiteList, `ParentMessageNo DESC, CreateDate DESC`);
        let strFilter = await baseModel.buildFilter(objSearch, fieldWhiteList, sqlRequest);

        let sqlCount = `SELECT COUNT(A.MessageNo) row_count FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter + ";"
        sqlStr = `WITH query AS (SELECT ROW_NUMBER() OVER(` + orderStr + `) AS line, * FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter +`) SELECT TOP (@PageSize) * FROM query WHERE line > (@Page - 1) * @PageSize;`;
        sqlStr += sqlCount;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            dataReturn = res.recordsets[0];
            totalRecord = res.recordsets[1][0].row_count;
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Message.js" },
                { key: "Function", content: "searchMessage" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Message.js" },
                { key: "Function", content: "searchMessage" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Message.js" },
            { key: "Function", content: "searchMessage" },
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

async function sendMessage(data) {
    return baseModel.createNewGetId(T_Table, data);
}
//#endregion

module.exports = {
    getListMessage,
    getDetailMessage,
    createMessage,
    updateMessage,
    updateMessageFlag,
    getMessageByIdOrUser,
    searchMessage,
    sendMessage
}