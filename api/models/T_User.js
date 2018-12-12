'use strict';
const baseModel = require('../base/BaseModel');
const validation = require('../util/validation');

const sql = baseModel.sql;
const systemConfig = require('config');
const passEncrypt = systemConfig.get('TestENV.passwordEncrypt');
const ResCode = require('../util/validation').RESPONSE_CODE;
const logService = require('../services/LogService');

const T_Table = {
    tableName: "T_User",
    columns: [
        { key: "UserNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "LoginId", type: sql.VarChar(255), isPk: false, defaultValue: null },
        { key: "Password", type: sql.VarBinary, isPk: false, defaultValue: null },
        { key: "AgentCd", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "CustomerNumber", type: sql.VarChar(10), isPk: false, defaultValue: null },
        { key: "HokenShokenF", type: sql.Bit, isPk: false, defaultValue: null },
        { key: "Memo", type: sql.NVarChar(1000), isPk: false, defaultValue: null },
        { key: "IqCustomerNo", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "KaniShindanF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "ShokenBunsekiF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" },
        { key: "DelF", type: sql.Bit(1), isPk: false, defaultValue: 0 },
    ]
};
const fieldWhiteList = [
    "UserNo",
    "LoginId",
    "AgentCd",
    "CustomerNumber",
    "HokenShokenF",
    "Memo",
    "IqCustomerNo",
    "KaniShindanF",
    "ShokenBunsekiF",
    "CreateDate",
    "UpdateDate",
    "FamilyNo",
    "LastName",
    "FirstName",
    "Relation",
    "Sex",
    "Birthday",
    "SeqNo",
    "IqFamilyNo",
    "SexName",
    "KaniShindanFName",
    "ShokenBunsekiFName",
    "Age",
    "CustommerFullName"
];

function fillData(user) {
    let data = {
        UserNo: null,
        LoginId: user.LoginId,
        Password: user.Password,
        AgentCd: user.AgentCd,
        CustomerNumber: user.CustomerNumber,
        HokenShokenF: 0,
        CreateDate: new Date(),
        UpdateDate: new Date()
    };

    let sqlRequest = new sql.Request();
    sqlRequest.input('LoginId', sql.NVarChar, data.LoginId);
    sqlRequest.input('Password', sql.NVarChar, data.Password);
    sqlRequest.input('AgentCd', sql.Char(5), data.AgentCd);
    sqlRequest.input('CustomerNumber', sql.VarChar(20), data.CustomerNumber);
    sqlRequest.input('HokenShokenF', sql.Bit, 0);
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
        ,T1.CustomerNumber
        ,T1.AgentCd
        ,T1.HokenShokenF
        ,convert(nvarchar(MAX), DecryptByPassphrase('${passEncrypt.passPhrase}', T1.Password, 1, convert(varbinary(MAX), '${passEncrypt.expression}'))) AS Password
        ,T2.FamilyNo
         FROM T_User T1 LEFT JOIN T_Family T2 ON (T1.UserNo = T2.UserNo AND T2.Relation = 0) WHERE T1.DelF = 0 AND T1.LoginId = @loginId`;
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
            AgentCd,
            CustomerNumber,
            CreateDate,
            UpdateDate
        ) VALUES (
            @LoginId,
            ENCRYPTBYPASSPHRASE('${passEncrypt.passPhrase}',@Password,1,convert(varbinary(MAX), '${passEncrypt.expression}')),
            @AgentCd,
            @CustomerNumber,
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

async function asyncResetPassword(user) {
    let queryResult = null;
    let sqlRequest = new sql.Request();
    sqlRequest.input('LoginId', sql.VarChar(255), user.LoginId);
    sqlRequest.input('Password', sql.NVarChar, user.Password);
    
    let sqlStr = `UPDATE ${T_Table.tableName} SET Password = ENCRYPTBYPASSPHRASE('${passEncrypt.passPhrase}',@Password,1,convert(varbinary(MAX), '${passEncrypt.expression}')) WHERE LoginId = @LoginId`
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
        queryResult = res;

        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_User.js" },
            { key: "Function", content: "asyncResetPassword" },
            { key: "Sql", content: sqlStr },
            { key: "Param", content: JSON.stringify(user) }
        ]
        await logService.sqlLog(logData);
    }).catch(async function(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_User.js" },
            { key: "Function", content: "asyncResetPassword" },
            { key: "Sql", content: sqlStr },
            { key: "Param", content: JSON.stringify(user) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);
    });
    return queryResult;
}

async function updateUser(data) {
    return baseModel.updateById(T_Table, data);
}

//#region only kanri -------------------------------------------------------------------------------------
async function searchCustomer(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let yearFrom = 1;
    let monthFrom = 1;
    let monthTo = 1;

    if (!validation.isEmptyObject(objSearch.FullName)) {
        sqlRequest.input("FullName", sql.NVarChar(200), "%" + objSearch.FullName + "%");
    }
    if (!validation.isEmptyObject(objSearch.Email)) {
        sqlRequest.input("Email", sql.NVarChar(255), "%" + objSearch.Email + "%");
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

    if (!validation.isEmptyObject(objSearch.KaniShindanFilter)) {
        sqlRequest.input("KaniShindanFilter", sql.NVarChar, objSearch.KaniShindanFilter);
    }
    if (!validation.isEmptyObject(objSearch.ShokenBunsekiFilter)) {
        sqlRequest.input("ShokenBunsekiFilter", sql.NVarChar, objSearch.ShokenBunsekiFilter);
    }
    sqlRequest.input("Page", sql.Int, parseInt(objSearch.Page));
    sqlRequest.input("PageSize", sql.Int, parseInt(objSearch.PageSize));
    
    let dataReturn;
    let totalRecord = 0;
    try {
        let sqlStr = `SELECT
         T1.UserNo
        ,T1.LoginId
        ,T1.AgentCd
        ,T1.CustomerNumber
        ,T1.HokenShokenF
        ,T1.Memo
        ,T1.IqCustomerNo
        ,T1.KaniShindanF
        ,T1.ShokenBunsekiF
        ,T2.CreateDate
        ,T2.UpdateDate
        ,T2.FamilyNo
        ,T2.LastName
        ,T2.FirstName
        ,CONCAT(T2.LastName, ' ', T2.FirstName) CustommerFullName
        ,T2.Relation
        ,T2.Sex
        ,T2.Birthday
        ,T2.SeqNo
        ,T2.IqFamilyNo 
        ,T3.name SexName
        ,(CASE T1.KaniShindanF WHEN  0 THEN N'なし' WHEN 1 THEN N'完了' WHEN 2 THEN N'依頼' END) KaniShindanFName
        ,(CASE T1.ShokenBunsekiF WHEN 0 THEN N'なし' WHEN 1 THEN N'完了' WHEN 2 THEN N'依頼' END) ShokenBunsekiFName
        ,CONVERT(int, (DATEDIFF(day, T2.Birthday, GETDATE()) / 365.25)) Age
         FROM T_User T1 INNER JOIN T_Family T2 ON T1.UserNo = T2.UserNo
         LEFT JOIN M_SelectItem T3 ON T2.Sex = T3.selNo AND T3.selType = 6
         WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.FullName)) {
            sqlStr += ` AND (T2.FirstName LIKE @FullName OR T2.LastName LIKE @FullName OR CONCAT(T2.LastName, ' ', T2.FirstName) LIKE @FullName)`;
        }
        if (!validation.isEmptyObject(objSearch.Email)) {
            sqlStr += ` AND T1.LoginId LIKE @Email`;
        }
        if (!validation.isEmptyObject(objSearch.FromDate)) {
            if (!validation.isEmptyObject(objSearch.ToDate)) {
                let arrFromDate = objSearch.FromDate.split('-');
                let arrToDate = objSearch.ToDate.split('-');
                if (arrFromDate[0] === arrToDate[0] && arrFromDate[0] === '9000') {
                    sqlStr += ` AND DATEPART(month, T2.Birthday) >= @monthFrom`;
                }
                else if (arrFromDate[0] === '9000' && arrToDate[0] !== '9000') {
                    sqlStr += ` AND (
                        (DATEPART(month, T2.Birthday) >= @monthFrom AND DATEPART(year, T2.Birthday) < @yearFrom) OR
                        (DATEPART(year, T2.Birthday) >= @yearFrom AND DATEADD(d, 0, DATEDIFF(d, 0, T2.Birthday)) <= @FromDate)
                    )`;
                }
                else {
                    sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, T2.Birthday)) >= @FromDate`;
                }
            }
            else {
                sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, T2.Birthday)) >= @FromDate`;
            }
        }
        if (!validation.isEmptyObject(objSearch.ToDate)) {
            if (!validation.isEmptyObject(objSearch.FromDate)) {
                let arrFromDate = objSearch.FromDate.split('-');
                let arrToDate = objSearch.ToDate.split('-');
                if (arrFromDate[0] === arrToDate[0] && arrFromDate[0] === '9000') {
                    sqlStr += ` AND DATEPART(month, T2.Birthday) <= @monthTo`;
                }
                else {
                    sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, T2.Birthday)) <= @ToDate`;
                }
            }
            else {
                sqlStr += ` AND DATEADD(d, 0, DATEDIFF(d, 0, T2.Birthday)) <= @ToDate`;
            }
        }
        if (!validation.isEmptyObject(objSearch.AgentCd)) {
            sqlStr += ` AND T1.AgentCd = @AgentCd`;
        }
        if (!validation.isEmptyObject(objSearch.KaniShindanFilter)) {
            sqlStr += ` AND CHARINDEX(CONCAT(',', T1.KaniShindanF, ','), @KaniShindanFilter) > 0`;
        }
        if (!validation.isEmptyObject(objSearch.ShokenBunsekiFilter)) {
            sqlStr += ` AND CHARINDEX(CONCAT(',', T1.ShokenBunsekiF, ','), @ShokenBunsekiFilter) > 0`;
        }

        let orderStr = await baseModel.buildOrder(objSearch, fieldWhiteList, `CreateDate DESC`);
        let strFilter = await baseModel.buildFilter(objSearch, fieldWhiteList, sqlRequest);

        sqlStr += ` AND T1.DelF = 0 AND T2.DelF = 0`;
        let sqlCount = `SELECT COUNT(A.FamilyNo) row_count FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter + ";"
        sqlStr = `WITH query AS (SELECT ROW_NUMBER() OVER(` + orderStr + `) AS line, * FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter +`) SELECT TOP (@PageSize) * FROM query WHERE line > (@Page - 1) * @PageSize;`;
        sqlStr += sqlCount;
        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            dataReturn = res.recordsets[0];
            totalRecord = res.recordsets[1][0].row_count;
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "searchCustomer" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "searchCustomer" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_User.js" },
            { key: "Function", content: "searchCustomer" },
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

async function searchTargetCustomer(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let dataReturn;
    try {
        let sqlStr = `SELECT * FROM (SELECT
             T1.UserNo
            ,T2.FamilyNo
            ,T2.Sex
            ,CAST((DATEDIFF(day, T2.Birthday, GETDATE()) / 365.25) AS INT) Age
            ,T1.DelF`;

        /*
        if (!validation.isEmptyObject(objSearch.Kikan)) {
            sqlStr += `,(
                SELECT COUNT(*)
                FROM (
                    SELECT 
                         ROW_NUMBER() OVER(PARTITION BY GRP ORDER BY B.CreateDate) AS RW
                        ,B.UserNo
                        ,B.CreateDate
                    FROM (
                        SELECT
                             A.UserNo
                            ,CONVERT(varchar, A.CreateDate, 111) CreateDate
                            ,DATEDIFF(Day, '1900-01-01' , A.CreateDate)- ROW_NUMBER() OVER( ORDER BY A.CreateDate ) AS GRP
                        FROM (
                            SELECT DISTINCT
                                 T.UserNo
                                ,T.ActionContent
                                ,CONVERT(VARCHAR, T.CreateDate, 111) CreateDate
                            FROM T_Riyo T
                            WHERE T.ActionContent = 'ログイン' AND T.UserNo = T1.UserNo AND T1.DelF = 0
                        ) A
                    ) B
                ) C
                WHERE C.RW >= @KikanDays
            ) LoginContinue`;
        }
        */

        sqlStr += ` FROM T_User T1 INNER JOIN T_Family T2 ON T1.UserNo = T2.UserNo AND T2.Relation = 0) F WHERE F.DelF = 0`;

        if (!validation.isEmptyObject(objSearch.TargetSex)) {
            if (objSearch.TargetSex === 0 || objSearch.TargetSex === 1) {
                sqlRequest.input("TargetSex", sql.Int, objSearch.TargetSex);
                sqlStr += ` AND F.Sex = @TargetSex`;
            }
        }

        if (!validation.isEmptyObject(objSearch.Marriage)) {
            if (objSearch.Marriage === 0 || objSearch.Marriage === 1) {
                if (objSearch.Marriage === 0) {
                    sqlStr += ` AND F.UserNo IN (
                        SELECT UserNo
                        FROM T_Family
                        WHERE (Relation = 1 OR Relation = 2) AND DelF = 0
                    )`;
                }
                else {
                    sqlStr += ` AND F.UserNo NOT IN (
                        SELECT UserNo
                        FROM T_Family
                        WHERE (Relation = 1 OR Relation = 2) AND DelF = 0
                    )`;
                }
            }
        }

        if (!validation.isEmptyObject(objSearch.Haschild)) {
            if (objSearch.Haschild === 0 || objSearch.Haschild === 1) {
                if (objSearch.Haschild === 0) {
                    sqlStr += ` AND F.UserNo IN (
                        SELECT UserNo
                        FROM T_Family
                        WHERE Relation = 13 AND DelF = 0
                    )`;
                }
                else {
                    sqlStr += ` AND F.UserNo NOT IN (
                        SELECT UserNo
                        FROM T_Family
                        WHERE Relation = 13 AND DelF = 0
                    )`;
                }
            }
        }

        if (!validation.isEmptyObject(objSearch.TargetAge)) {
            switch (objSearch.TargetAge) {
                case 1: // age >= 20 and age <= 29
                    sqlStr += ` AND (F.Age BETWEEN 20 AND 29)`;
                    break;
                case 2: // age >= 30 and age <= 39
                    sqlStr += ` AND (F.Age BETWEEN 30 AND 39)`;
                    break;
                case 3: // age >= 20 and age <= 39
                    sqlStr += ` AND (F.Age BETWEEN 20 AND 39)`;
                    break;
                case 4: // age >= 40 and age <= 49
                    sqlStr += ` AND (F.Age BETWEEN 40 AND 49)`;
                    break;
                case 5: // (age >= 20 and age <= 29) or (age >= 40 and age <= 49)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 29) OR (F.Age BETWEEN 40 AND 49)
                    )`;
                    break;
                case 6: // age >= 30 and age <= 49
                    sqlStr += ` AND (F.Age BETWEEN 30 AND 49)`;
                    break;
                case 7: // age >= 20 and age <= 49
                    sqlStr += ` AND (F.Age BETWEEN 20 AND 49)`;
                    break;
                case 8: // age >= 50 and age <= 59
                    sqlStr += ` AND (F.Age BETWEEN 50 AND 59)`;
                    break;
                case 9: // (age >= 20 and age <= 29) or (age >= 50 and age <= 59)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 29) OR (F.Age BETWEEN 50 AND 59)
                    )`;
                    break;
                case 10: // (age >= 30 and age <= 39) or (age >= 50 and age <= 59)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 30 AND 39) OR (F.Age BETWEEN 50 AND 59)
                    )`;
                    break;
                case 11: // (age >= 20 and age <= 39) or (age >= 50 and age <= 59)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 39) OR (F.Age BETWEEN 50 AND 59)
                    )`;
                    break;
                case 12: // age >= 40 and age <= 59
                    sqlStr += ` AND (F.Age BETWEEN 40 AND 59)`;
                    break;
                case 13: // (age >= 20 and age <= 29) or (age >= 40 and age <= 59)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 29) OR (F.Age BETWEEN 40 AND 59)
                    )`;
                    break;
                case 14: // age >= 30 and age <= 59
                    sqlStr += ` AND (F.Age BETWEEN 30 AND 59)`;
                    break;
                case 15: // age >= 20 and age <= 59
                    sqlStr += ` AND (F.Age BETWEEN 20 AND 59)`;
                    break;
                case 16: // age >= 60 and age <= 69
                    sqlStr += ` AND (F.Age BETWEEN 60 AND 69)`;
                    break;
                case 17: // (age >= 20 and age <= 29) or (age >= 60 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 29) OR (F.Age BETWEEN 60 AND 69)
                    )`;
                    break;
                case 18: // (age >= 30 and age <= 39) or (age >= 60 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 30 AND 39) OR (F.Age BETWEEN 60 AND 69)
                    )`;
                    break;
                case 19: // (age >= 20 and age <= 39) or (age >= 60 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 39) OR (F.Age BETWEEN 60 AND 69)
                    )`;
                    break;
                case 20: // (age >= 40 and age <= 49) or (age >= 60 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 40 AND 49) OR (F.Age BETWEEN 60 AND 69)
                    )`;
                    break;
                case 21: // (age >= 20 and age <= 29) or (age >= 40 and age <= 49) or (age >= 60 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 29) OR (F.Age BETWEEN 40 AND 49) OR (F.Age BETWEEN 60 AND 69)
                    )`;
                    break;
                case 22: // (age >= 30 and age <= 49) or (age >= 60 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 30 AND 49) OR (F.Age BETWEEN 60 AND 69)
                    )`;
                    break;
                case 23: // (age >= 20 and age <= 49) or (age >= 60 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 49) OR (F.Age BETWEEN 60 AND 69)
                    )`;
                    break;
                case 24: // age >= 50 and age <= 69
                    sqlStr += ` AND (F.Age BETWEEN 50 AND 69)`;
                    break;
                case 25: // (age >= 20 and age <= 29) or (age >= 50 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 29) OR (F.Age BETWEEN 50 AND 69)
                    )`;
                    break;
                case 26: // (age >= 30 and age <= 39) or (age >= 50 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 30 AND 39) OR (F.Age BETWEEN 50 AND 69)
                    )`;
                    break;
                case 27: // (age >= 20 and age <= 39) or (age >= 50 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 39) OR (F.Age BETWEEN 50 AND 69)
                    )`;
                    break;
                case 28: // age >= 40 and age <= 69
                    sqlStr += ` AND (F.Age BETWEEN 40 AND 69)`;
                    break;
                case 29: // (age >= 20 and age <= 29) or (age >= 40 and age <= 69)
                    sqlStr += ` AND (
                        (F.Age BETWEEN 20 AND 29) OR (F.Age BETWEEN 40 AND 69)
                    )`;
                    break;
                case 30: // age >= 30 and age <= 69
                    sqlStr += ` AND (F.Age BETWEEN 30 AND 69)`;
                    break;
                case 31: // age >= 20 and age <= 69
                    sqlStr += ` AND (F.Age BETWEEN 20 AND 69)`;
                    break;
              }
        }
        
        if (!validation.isEmptyObject(objSearch.Kanyushite)) {
            sqlRequest.input("KanyuHoshoCategory", sql.Int, objSearch.KanyuHoshoCategory);
            if (objSearch.Kanyu === 0) {
                // not access
                sqlStr += ` AND (F.UserNo NOT IN (
                    SELECT Fa.UserNo
                    FROM T_Family Fa
                    WHERE Fa.FamilyNo IN (
                        SELECT K.FamilyNo
                        FROM T_Keiyaku K
                        WHERE K.DelF = 0 AND K.HoshoCategoryF = @KanyuHoshoCategory
                    )
                ))`;
            }
            else {
                // access
                sqlStr += ` AND (F.UserNo IN (
                    SELECT Fa.UserNo
                    FROM T_Family Fa
                    WHERE Fa.FamilyNo IN (
                        SELECT K.FamilyNo
                        FROM T_Keiyaku K
                        WHERE K.DelF = 0 AND K.HoshoCategoryF = @KanyuHoshoCategory
                    )
                ))`;
            }
        }

        if (!validation.isEmptyObject(objSearch.Kikan)) {
            sqlRequest.input("KikanDays", sql.Int, objSearch.KikanDays);
            if (objSearch.Kikan === 1) {
                // login on many day
                sqlStr += ` AND F.UserNo IN (
                    SELECT UserNo
                    FROM T_Riyo
                    WHERE CreateDate BETWEEN DATEADD(day, -@KikanDays, GETDATE()) AND GETDATE()
                )`;
            }
            else {
                // not login on many day
                sqlStr += ` AND F.UserNo NOT IN (
                    SELECT UserNo
                    FROM T_Riyo
                    WHERE CreateDate BETWEEN DATEADD(day, -@KikanDays, GETDATE()) AND GETDATE()
                )`;
            }

            /*
            if (objSearch.Kanyu === 1) {
                // login continue on many day
                sqlStr += ` AND F.LoginContinue > 0`;
            }
            else {
                // not login continue on many day
                sqlStr += ` AND F.LoginContinue = 0`;
            }
            */
        }

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            dataReturn = res.recordsets[0];
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "searchTargetCustomer" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "searchTargetCustomer" },
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
            { key: "File", content: "T_User.js" },
            { key: "Function", content: "searchTargetCustomer" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);
        
        return false;
    }
    
    return dataReturn;
}

async function getCustomerInfo(objSearch) {
    let user = null;
    try{
        let sqlRequest = new sql.Request();
        sqlRequest.input('UserNo', sql.BigInt, objSearch.UserNo);

        let sqlStr = `SELECT
         T1.UserNo
        ,T1.KaniShindanF
        ,T1.IqCustomerNo
        ,CONCAT(T2.LastName, '', T2.FirstName) CustommerFullName
        ,T2.FamilyNo
         FROM T_User T1 LEFT JOIN T_Family T2 ON (T1.UserNo = T2.UserNo AND T2.Relation = 0) WHERE T1.DelF = 0 AND T1.UserNo = @UserNo`;
        
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
                { key: "Function", content: "getCustomerInfo" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_User.js" },
                { key: "Function", content: "asyncGetUserbyLoginId" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
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
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return null;
    }
    return user;
}
//#endregion

module.exports = {
    asyncGetUserbyLoginId,
    asyncCreateUser,
    asyncResetPassword,
    updateUser,
    searchCustomer,
    searchTargetCustomer,
    getCustomerInfo
}