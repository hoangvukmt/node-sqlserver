'use strict';
const baseModel = require('../base/BaseModel');
const logService = require('../services/LogService');
const validation = require('../util/validation');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_Keiyaku",
    columns: [
        { key: "KeiyakuNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "GroupID", type: sql.BigInt(8), isPk: false, defaultValue: 0 },
        { key: "FamilyNo", type: sql.BigInt(8), isPk: false, defaultValue: 0 },
        { key: "FamilyName", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "HihoFamilyNo", type: sql.BigInt(8), isPk: false, defaultValue: 0 },
        { key: "HihoFamilyName", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "AgentNo", type: sql.BigInt(5), isPk: false, defaultValue: 0 },
        { key: "CompanyCd", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "CompanyName", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "TantoNameCompany", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "Phone", type: sql.Char(20), isPk: false, defaultValue: null },
        { key: "URL", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "Memo", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "HoshoCategoryF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "ProductCd", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "ProductName", type: sql.NVarChar(400), isPk: false, defaultValue: null },
        { key: "CategoryCd", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "PolicyNo", type: sql.NVarChar(30), isPk: false, defaultValue: null },
        { key: "Status", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "ContractDate", type: sql.DateTime, isPk: false, defaultValue: null },
        { key: "HokenEndDate", type: sql.DateTime, isPk: false, defaultValue: null },
        { key: "HKikanF", type: sql.TinyInt(1), isPk: false, defaultValue: null },
        { key: "HKikan", type: sql.SmallInt(2), isPk: false, defaultValue: null },
        { key: "HokenP", type: sql.Decimal(12), isPk: false, defaultValue: null },
        { key: "Haraikata", type: sql.TinyInt(1), isPk: false, defaultValue: null },
        { key: "PKikanF", type: sql.TinyInt(1), isPk: false, defaultValue: null },
        { key: "PKikan", type: sql.SmallInt(2), isPk: false, defaultValue: null },
        { key: "KaniShindanF", type: sql.Bit(1), isPk: false, defaultValue: 0 },
        { key: "ShokenBunsekiF", type: sql.Bit(1), isPk: false, defaultValue: 0 },
        { key: "NyuryokuF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "DelF", type: sql.Bit(1), isPk: false, defaultValue: 0 },
        { key: "TantoNameKeiyaku", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" },
        { key: "registeredF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "ForeignF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "ContactAccident", type: sql.VarChar(20), isPk: false, defaultValue: null },
        { key: "ContactCarFailure", type: sql.VarChar(20), isPk: false, defaultValue: null },
        { key: "CarName", type: sql.NVarChar(400), isPk: false, defaultValue: null },
        { key: "RegistNo", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "Address", type: sql.NVarChar(500), isPk: false, defaultValue: null },
        { key: "CurrencyF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 }
    ]
};

const T_OCR_TaiouJoukyou = {
    Mi_Taiou: 0,
    Gazo_Hosei: 2,
    Henkan_Zumi: 1,
    Title_Const: '様から自動入力の依頼がありました。'
}

const fieldWhiteList = [
    "CreateDate",
    "HihoFamilyName",
    "TypeName",
    "count_img",
    "FamilyName",
    "Title"
];

async function getListKeiyaku(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         T1.KeiyakuNo
        ,T1.GroupID
        ,T1.FamilyNo
        ,T1.FamilyName
        ,T1.HihoFamilyNo
        ,T1.HihoFamilyName
        ,T1.AgentNo
        ,T1.CompanyCd
        ,T1.CompanyName
        ,T1.TantoNameCompany
        ,T1.Phone
        ,T1.URL
        ,T1.Memo
        ,T1.HoshoCategoryF
        ,T1.ProductCd
        ,T1.ProductName
        ,T1.CategoryCd
        ,T1.PolicyNo
        ,T1.Status
        ,T1.ContractDate
        ,T1.HokenEndDate
        ,T1.HKikanF
        ,T1.HKikan
        ,T1.HokenP
        ,T1.CurrencyF
        ,T1.Haraikata
        ,T1.PKikanF
        ,T1.PKikan
        ,T1.ForeignF
        ,T1.ContactAccident
        ,T1.ContactCarFailure
        ,T1.CarName
        ,T1.RegistNo
        ,T1.Address
        ,T1.KaniShindanF
        ,T1.ShokenBunsekiF
        ,T1.NyuryokuF
        ,T1.registeredF
        ,T1.DelF
        ,T1.TantoNameKeiyaku
        ,T1.CreateDate
        ,T1.UpdateDate
         FROM T_Keiyaku T1
         WHERE 1 = 1 AND T1.DelF = 0`;

        if (!validation.isEmptyObject(objSearch.GroupID)) {
            sqlStr += ` AND T1.GroupID = @GroupID`;
        }
        if (!validation.isEmptyObject(objSearch.FamilyNo)) {
            sqlStr += ` AND T1.FamilyNo = @FamilyNo`;
        }
        if (!validation.isEmptyObject(objSearch.HihoFamilyNo)) {
            sqlStr += ` AND (T1.HihoFamilyNo = @HihoFamilyNo OR T1.HihoFamilyNo = 0)`;
        }
        if (!validation.isEmptyObject(objSearch.AgentNo)) {
            sqlStr += ` AND T1.AgentNo = @AgentNo`;
        }
        if (!validation.isEmptyObject(objSearch.HoshoCategoryF)) {
            sqlStr += ` AND T1.HoshoCategoryF = @HoshoCategoryF`;
        }
        if (!validation.isEmptyObject(objSearch.Status)) {
            sqlStr += ` AND T1.Status = @Status`;
        }
        sqlStr += ` ORDER BY T1.HoshoCategoryF ASC`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getListKeiyaku" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getListKeiyaku" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Keiyaku.js" },
            { key: "Function", content: "getListKeiyaku" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    
    return data;
}

async function getKeiyakuByUser(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         T1.KeiyakuNo
        ,T1.GroupID
        ,T1.FamilyNo
        ,T1.FamilyName
        ,T1.HihoFamilyNo
        ,T1.HihoFamilyName
        ,T1.AgentNo
        ,T1.CompanyCd
        ,T1.CompanyName
        ,T1.TantoNameCompany
        ,T1.Phone
        ,T1.URL
        ,T1.Memo
        ,T1.HoshoCategoryF
        ,T1.ProductCd
        ,T1.ProductName
        ,T1.CategoryCd
        ,T1.PolicyNo
        ,T1.Status
        ,T1.ContractDate
        ,T1.HokenEndDate
        ,T1.HKikanF
        ,T1.HKikan
        ,T1.HokenP
        ,T1.Haraikata
        ,T1.PKikanF
        ,T1.PKikan
        ,T1.KaniShindanF
        ,T1.ShokenBunsekiF
        ,T1.NyuryokuF
        ,T1.DelF
        ,T1.TantoNameKeiyaku
        ,T1.CreateDate
        ,T1.UpdateDate
        ,T1.ForeignF
        ,T1.ContactAccident
        ,T1.ContactCarFailure
        ,T1.CarName
        ,T1.RegistNo
        ,T1.Address
        ,T1.CurrencyF
         FROM T_Keiyaku T1 WHERE 1 = 1`;

        if (!validation.isEmptyObject(objSearch.UserNo)) {
            sqlRequest.input('UserNo', sql.BigInt, objSearch.UserNo);
            sqlStr += ` AND T1.FamilyNo IN (SELECT FamilyNo FROM T_Family WHERE UserNo = @UserNo AND DelF = 0)`;
        }
        if (!validation.isEmptyObject(objSearch.KaniShindanF)) {
            sqlStr += ` AND T1.KaniShindanF = @KaniShindanF`;
        }
        sqlStr += ` AND T1.DelF = 0`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getKeiyakuByUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getKeiyakuByUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Keiyaku.js" },
            { key: "Function", content: "getKeiyakuByUser" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    
    return data;
}

async function getDetailKeiyaku(objSearch) {
    let data;
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    try {
        let sqlStr = `SELECT
         T1.KeiyakuNo
        ,T1.GroupID
        ,T1.FamilyNo
        ,T1.HihoFamilyNo
        ,T1.AgentNo
        ,T1.CompanyCd
        ,T1.CompanyName
        ,T1.TantoNameCompany
        ,T1.Phone
        ,T1.URL
        ,T1.Memo
        ,T1.HoshoCategoryF
        ,T1.ProductCd
        ,T1.ProductName
        ,T1.CategoryCd
        ,T1.PolicyNo
        ,T1.Status
        ,CONVERT(varchar, T1.ContractDate, 111) ContractDate
        ,CONVERT(varchar, T1.HokenEndDate, 111) HokenEndDate
        ,T1.HKikanF
        ,T1.HKikan
        ,T1.HokenP
        ,T1.Haraikata
        ,T1.PKikanF
        ,T1.PKikan
        ,T1.KaniShindanF
        ,T1.ShokenBunsekiF
        ,T1.TantoNameKeiyaku
        ,T1.NyuryokuF
        ,T1.ForeignF
        ,T12.name ForeignFName
        ,T1.ContactAccident
        ,T1.ContactCarFailure
        ,T1.CarName
        ,T1.RegistNo
        ,T1.Address
        ,T1.CurrencyF
        ,T13.name CurrencyFName
        ,T10.FileName
        ,T2.AgentName
        ,T2.TantoName AgentTantoName
        ,T2.Phone AgentPhone
        ,T2.KeiyakuPage AgentUrl
        ,T2.Remarks AgentMemo
        ,T1.FamilyName
        ,T1.HihoFamilyName
        ,(CASE WHEN T1.HKikanF = 3 OR T1.HKikanF = 8 THEN T7.name ELSE CONCAT(T1.HKikan, ' ', T7.name) END) HKikanName
        ,T4.name StatusName
        ,T8.name HaraikataName
        ,(CASE WHEN T1.PKikanF = 3 OR T1.PKikanF = 8 THEN T9.name ELSE CONCAT(T1.PKikan, ' ', T9.name) END) PKikanName
        ,T11.name HoshoCategoryName
        ,(SELECT COUNT(*) FROM T_File WHERE GroupID = T1.GroupID ANd DelF = 0) countImg
        FROM T_Keiyaku T1 LEFT JOIN T_Agent T2 ON T1.AgentNo = T2.AgentNo
        LEFT JOIN V_Company T3 ON T1.CompanyCd = T3.CompanyCd
        LEFT JOIN M_SelectItem T4 ON T1.Status = T4.selNo AND T4.selType = 12
        LEFT JOIN T_Family T5 ON T1.FamilyNo = T5.FamilyNo
        LEFT JOIN T_Family T6 ON T1.HihoFamilyNo = T6.FamilyNo
        LEFT JOIN M_SelectItem T8 ON T1.Haraikata = T8.selNo AND T8.selType = 13
        LEFT JOIN M_SelectItem T7 ON T1.HKikanF = T7.selNo AND T7.selType = 16
        LEFT JOIN M_SelectItem T9 ON T1.PKikanF = T9.selNo AND T9.selType = 16
        LEFT JOIN T_Group T10 ON T1.GroupID = T10.GroupID
        LEFT JOIN M_SelectItem T11 ON T1.HoshoCategoryF = T11.selNo AND T11.selType = 3
        LEFT JOIN M_SelectItem T12 ON T1.ForeignF = T12.selNo AND T12.selType = 21
        LEFT JOIN M_SelectItem T13 ON T1.CurrencyF = T13.selNo AND T13.selType = 21
        WHERE T1.KeiyakuNo = @KeiyakuNo`;

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
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getDetailKeiyaku" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getDetailKeiyaku" },
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
            { key: "File", content: "T_Keiyaku.js" },
            { key: "Function", content: "getDetailKeiyaku" },
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

async function createKeiyaku(data) {
    return baseModel.createNewGetId(T_Table, data);
}

async function updateKeiyaku(data) {
    return baseModel.updateById(T_Table, data);
}

async function deleteKeiyaku(objSearch) {
    let objDataUpdate = {
        DelF: 1,
        KeiyakuNo: objSearch.KeiyakuNo,
        tokenData: objSearch.tokenData
    };
    return baseModel.updateById(T_Table, objDataUpdate);
}

async function updateKaniShindanF(UserNo, KaniShindanF) {
    let sqlRequest = baseModel.fillData(T_Table, {});
    sqlRequest.input('KaniShindanF', sql.Bit, KaniShindanF);
    sqlRequest.input('UserNo', sql.BigInt, UserNo);
    let result;
    try {
        let sqlStr = `UPDATE ${T_Table.tableName} SET KaniShindanF = @KaniShindanF WHERE FamilyNo IN (
            SELECT FamilyNo FROM T_Family WHERE UserNo = @UserNo AND DelF = 0
        )`;

        let query = new Promise(function(resolve, reject){
            sqlRequest.query(sqlStr, function(err, res){
                if(res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            result = true;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "updateKaniShindanF" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(family) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "updateKaniShindanF" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(family) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
        return result;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Keiyaku.js" },
            { key: "Function", content: "updateKaniShindanF" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(family) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return;
    } finally {
        return result;
    }
}

//#region only kanri -------------------------------------------------------------------------------------
async function getListProductByUser(userNo) {
    let sqlRequest = baseModel.fillData(T_Table, {});
    sqlRequest.input('UserNo', sql.BigInt, userNo);
    let data;

    try {
        let sqlStr = `SELECT
                 T1.LastName
                ,T1.FirstName
                ,T1.Relation
                ,T2.name RelationName
                ,T1.Sex
                ,T3.name SexName
                ,T1.Birthday
                ,T1.CreateDate
                ,T4.Memo
                ,T1.FamilyNo
                
                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '"
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.NyuryokuF != 0 
                    AND T.HoshoCategoryF = 1 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') LifeData

                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '"
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.NyuryokuF != 0 
                    AND T.HoshoCategoryF = 2 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') MedicalData

                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '"
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.NyuryokuF != 0 
                    AND T.HoshoCategoryF = 3 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') SavingsData

                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '"
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.NyuryokuF != 0 
                    AND T.HoshoCategoryF = 4 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') CarData

                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '"
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.NyuryokuF != 0 
                    AND T.HoshoCategoryF = 5 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') HouseData

                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '"
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.NyuryokuF != 0 
                    AND T.HoshoCategoryF = 6 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') SunData

                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '"
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.NyuryokuF != 0 
                    AND T.HoshoCategoryF = 7 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') AirplaneData

                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '"
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.HoshoCategoryF = 8 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') OtherData

                ,CONCAT('[', stuff((
                    SELECT CONCAT(', {"KeiyakuNo": ', T.KeiyakuNo, 
                        ', "CompanyName": "', T.CompanyName, 
                        '", "ProductName": "', T.ProductName, 
                        '", "ContractDate": "', CONVERT(VARCHAR(10), T.ContractDate, 111), 
                        '", "HokenP": "', T.HokenP,
                        '", "MoneyName": "', (SELECT TOP 1 H.HoshoName FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "Money": "', (SELECT TOP 1 H.ColumnVal FROM T_KeiyakuHosho H WHERE H.KeiyakuTokuyakuNo = 0 and H.TypeF = 10 and H.KeiyakuNo = T.KeiyakuNo order by H.CreateDate desc),
                        '", "registeredF": ', T.registeredF,
                        ', "isCheck": ', 0,
                        ', "HKikan": "', (CASE T.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.HKikan WHEN 0 THEN '' ELSE CONCAT(T.HKikan, ' ', MHkikan.name) END) END),
                        '", "PKikan": "', (CASE T.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MHkikan.name ELSE (CASE T.PKikan WHEN 0 THEN '' ELSE CONCAT(T.PKikan, ' ', MPkikan.name) END) END),
                        '", "Haraikata": "', MHarai.name,
                        '", "ForeignFName": "', MForeignF.name,
                        '", "CurrencyFName": "', MCurrencyF.name,
                        '", "HoshoCategoryF": ', T.HoshoCategoryF,
                        '
                    }')
                    FROM T_Keiyaku T LEFT JOIN M_SelectItem MHarai ON T.Haraikata = MHarai.selNo AND MHarai.selType = 13
                    LEFT JOIN M_SelectItem MPkikan ON T.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
                    LEFT JOIN M_SelectItem MHkikan ON T.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
                    LEFT JOIN M_SelectItem MForeignF ON T.ForeignF = MForeignF.selNo AND MForeignF.selType = 21
                    LEFT JOIN M_SelectItem MCurrencyF ON T.CurrencyF = MCurrencyF.selNo AND MCurrencyF.selType = 21
                    WHERE T.NyuryokuF = 0 
                    AND (T.HihoFamilyNo = T1.FamilyNo OR (T.HihoFamilyNo = 0 AND T1.Relation = 0))
                    AND T.DelF = 0 FOR XML PATH('')
                ), 1, 1,''), ']') AutoData
				
            FROM T_Family T1
            LEFT JOIN M_SelectItem T2 ON T1.Relation = T2.selNo AND T2.selType = 5
            LEFT JOIN M_SelectItem T3 ON T1.Sex = T3.selNo AND T3.selType = 6
            INNER JOIN T_User T4 ON T1.UserNo = T4.UserNo AND T4.DelF = 0
            WHERE T1.DelF = 0 AND T1.UserNo = @UserNo
            ORDER BY T1.Relation`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function (res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getKeiyakuByUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: {userNo: userNo} }
            ]
            await logService.sqlLog(logData);
        }).catch(async function (err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getKeiyakuByUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: {userNo: userNo} },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch (err) {
        let logData = [
            {key: "Time", content: new Date()},
            {key: "File", content: "T_Keiyaku.js"},
            {key: "Function", content: "getKeiyakuByUser"},
            {key: "Table", content: T_Table.tableName},
            {key: "Param", content: {userNo: userNo}},
            {key: "Err", content: err}
        ]
        await logService.errorLog(logData);

        return false;
    }

    return data;
}

async function getProductDetail(objParams) {
    let sqlRequest = baseModel.fillData(T_Table, {});
    sqlRequest.input('KeiyakuNo', sql.BigInt, objParams.KeiyakuNo);
    let data
    try {
        let sqlStr = `SELECT 
        CONCAT('[', stuff((
            SELECT CONCAT(
            ',{"KeiyakuNo": ', T1.KeiyakuNo, 
            ', "FamilyNo": ', T1.FamilyNo,
            ', "TantoNameCompany": "', T1.TantoNameCompany, 
            '", "CompanyName": "', T1.CompanyName, 
            '", "HihoFamilyName": "', T1.HihoFamilyName, 
            '", "FamilyName": "', T1.FamilyName, 
            '", "ProductName": "', T1.ProductName, 
            '", "PolicyNo": "', T1.PolicyNo, 
            '", "FamilyName": "', T1.FamilyName, 
            '", "HihoFamilyName": "', T1.HihoFamilyName, 
            '", "Hkikan": "', T1.Hkikan, 
            '", "HKikanF": "', T1.HKikanF, 
            '", "HokenP": "', T1.HokenP, 
            '", "PKikan": "', T1.PKikan, 
            '", "PKikanF": "', T1.PKikanF, 
            '", "HKikanName": "', (CASE T1.HKikanF WHEN 3 THEN MHkikan.name WHEN 8 THEN MHkikan.name ELSE CONCAT(T1.HKikan, ' ', MHkikan.name) END),
            '", "PKikanName": "', (CASE T1.PKikanF WHEN 3 THEN MPkikan.name WHEN 8 THEN MPkikan.name ELSE CONCAT(T1.PKikan, ' ', MPkikan.name) END),
            '", "CreateDate": "', CONVERT(VARCHAR(10), T1.CreateDate, 111), 
            '", "AgentName": "', T2.AgentName, 
            '", "Status": "', TS1.name, 
            '", "Haraikata": "', T1.Haraikata, 
            '", "HaraikataName": "', TS2.name, 
            '", "LastName": "', TF.LastName, 
            '", "FirstName": "', TF.FirstName, 
            '", "ContractDate": "', T1.ContractDate, 
            '", "HokenEndDate": "', T1.HokenEndDate, 
            '", "HoshoCategoryF": "', T1.HoshoCategoryF, 
            '", "UserNo": "', TF.UserNo, 
            '"}')
            FROM T_Keiyaku T1
            LEFT JOIN M_SelectItem MPkikan ON T1.PKikanF = MPkikan.selNo AND MPkikan.selType = 16
            LEFT JOIN M_SelectItem MHkikan ON T1.HKikanF = MHkikan.selNo AND MHkikan.selType = 16
            LEFT JOIN T_Agent AS T2 ON T1.AgentNo=T2.AgentNo  
            LEFT JOIN T_Family AS TF ON T1.FamilyNo=TF.FamilyNo                                     
            LEFT JOIN M_SelectItem TS1 ON T1.Status = TS1.selNo AND TS1.selType = 12                                        
            LEFT JOIN M_SelectItem TS2 ON T1.Haraikata = TS2.selNo AND TS2.selType = 13                                        
            WHERE T1.KeiyakuNo = @KeiyakuNo 
            FOR XML PATH('')
        ), 1, 1,''), ']') keiyakuData,
        CONCAT('[', stuff((
            SELECT CONCAT(
            ', {"KeiyakuNo": ', T2.KeiyakuNo, 
            ', "KeiyakuHoshoNo": ', T2.KeiyakuHoshoNo, 
            ', "ColumnVal": "', T2.ColumnVal, 
            '", "HoshoName": "', T2.HoshoName, 
            '", "Comment": "', T2.Comment, 
            '"}')
            FROM T_KeiyakuHosho T2
            WHERE T2.KeiyakuNo  = @KeiyakuNo 
            AND KeiyakuTokuyakuNo = 0 
            FOR XML PATH('')
        ), 1, 1,''), ']') shukeiyakuData,
        CONCAT('[', stuff((
            SELECT CONCAT(
            ', {"KeiyakuNo": ', T3.KeiyakuNo, 
            ', "TokuyakuName": "', T3.TokuyakuName, 
            '", "KeiyakuTokuyakuNo": "', T3.KeiyakuTokuyakuNo, 
            '", "KeiyakuTokuyakuNo": "', T3.KeiyakuTokuyakuNo, 
            '", "HoshoName": "', T2.HoshoName, 
            '", "ColumnVal": "', T2.ColumnVal, 
            '", "Comment": "', T2.Comment, 
            '"}')
            FROM T_KeiyakuToKuyaku T3 
            INNER JOIN T_KeiyakuHosho T2 
            ON T3.KeiyakuTokuyakuNo = T2.KeiyakuTokuyakuNo
            WHERE T3.KeiyakuNo  = @KeiyakuNo 
            FOR XML PATH('')
        ), 1, 1,''), ']') tokuyakuData`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function (res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getProductDetail" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objParams) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function (err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getProductDetail" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objParams) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch (err) {
        let logData = [
            {key: "Time", content: new Date()},
            {key: "File", content: "T_Keiyaku.js"},
            {key: "Function", content: "getProductDetail"},
            {key: "Table", content: T_Table.tableName},
            {key: "Param", content: JSON.stringify(objParams)},
            {key: "Err", content: err}
        ]
        await logService.errorLog(logData);

        return false;
    }

    return data;
}

async function getProductByKeiyakuno(objParams) {
    let sqlRequest = baseModel.fillData(T_Table, objParams);
    let data = {
        keiyaku: null,
        shukeiyaku: null,
        tokuyaku: null
    };
    //let data2;   
    try {
        let sqlStr = `SELECT
             T1.KeiyakuNo
            ,T1.GroupID
            ,T1.FamilyNo
            ,T1.FamilyName
            ,T1.HihoFamilyNo
            ,T1.HihoFamilyName
            ,T1.AgentNo
            ,T1.CompanyCd
            ,T1.CompanyName
            ,T1.TantoNameCompany
            ,T1.Phone
            ,T1.URL
            ,T1.Memo
            ,T1.HoshoCategoryF
            ,T1.ProductCd
            ,T1.ProductName
            ,T1.CategoryCd
            ,T1.PolicyNo
            ,T1.Status
            ,T1.ContractDate
            ,T1.HokenEndDate
            ,T1.HKikanF
            ,T1.HKikan
            ,T1.HokenP
            ,T1.Haraikata
            ,T1.PKikanF
            ,T1.PKikan
            ,T1.KaniShindanF
            ,T1.ShokenBunsekiF
            ,T1.NyuryokuF
            ,T1.DelF
            ,T1.TantoNameKeiyaku
            ,T1.CreateDate
            ,T1.UpdateDate
            ,T1.registeredF
            ,T1.ForeignF
            ,T1.ContactAccident
            ,T1.ContactCarFailure
            ,T1.CarName
            ,T1.RegistNo
            ,T1.Address
            ,T1.CurrencyF
            ,T2.LastName
            ,T2.FirstName
            ,T2.UserNo
            ,T3.AgentName
            ,(CASE T1.HKikanF WHEN 3 THEN T4.name WHEN 8 THEN T4.name ELSE CONCAT(T1.HKikan, ' ', T4.name) END) HKikanName
            ,T5.name HaraikataName
            ,(CASE T1.PKikanF WHEN 3 THEN T6.name WHEN 8 THEN T6.name ELSE CONCAT(T1.PKikan, ' ', T6.name) END) PKikanName
            ,T7.name ForeignFName
            ,T8.name CurrencyFName
            ,T9.name StatusName
            ,T10.name HoshoCategoryFName
        FROM T_Keiyaku T1 LEFT JOIN T_Family T2 ON T1.FamilyNo = T2.FamilyNo
        LEFT JOIN T_Agent T3 ON T1.AgentNo = T3.AgentNo
        LEFT JOIN M_SelectItem T4 ON T1.HKikanF = T4.selNo AND T4.selType = 16
        LEFT JOIN M_SelectItem T5 ON T1.Haraikata = T5.selNo AND T5.selType = 13
        LEFT JOIN M_SelectItem T6 ON T1.PKikanF = T6.selNo AND T6.selType = 16
        LEFT JOIN M_SelectItem T7 ON T1.ForeignF = T7.selNo AND T7.selType = 21
        LEFT JOIN M_SelectItem T8 ON T1.CurrencyF = T8.selNo AND T8.selType = 21
        LEFT JOIN M_SelectItem T9 ON T1.Status = T9.selNo AND T9.selType = 12
        LEFT JOIN M_SelectItem T10 ON T1.HoshoCategoryF = T10.selNo AND T10.selType = 3
        WHERE T1.KeiyakuNo = @KeiyakuNo;

        SELECT
             T1.KeiyakuHoshoNo
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
            ,(
                CASE T1.TypeF
                WHEN 40 THEN CONCAT(T3.LastName, T3.FirstName)
                WHEN 70 THEN T4.AgentName
                WHEN 50 THEN T5.COMPANYNAME
                WHEN 90 THEN T6.name
                WHEN 60 THEN T7.PRODUCTNAME
                WHEN 80 THEN (CASE T1.ColumnVal WHEN NULL THEN T8.name WHEN '' THEN T8.name ELSE CONCAT(T1.ColumnVal, T8.name) END)
                ELSE T2.name END
            ) ColumnValText	 
        FROM T_KeiyakuHosho T1
        LEFT JOIN M_SelectItem T2 ON (T1.SelType = T2.selType AND T1.ColumnVal = convert(nvarchar(200), T2.selNo))
        LEFT JOIN T_Family T3 ON (T1.ColumnVal = convert(nvarchar(200), T3.FamilyNo))
        LEFT JOIN T_Agent T4 ON (T1.ColumnVal = convert(nvarchar(200), T4.AgentNo))
        LEFT JOIN V_Company T5 ON T1.ColumnVal = T5.COMPANYCD
        LEFT JOIN M_SelectItem T6 ON (T1.ColumnVal = convert(nvarchar(200), T6.selNo) AND T6.selType = 3)
        LEFT JOIN V_Product T7 ON (T1.ColumnVal = T7.PRODUCTCD AND T7.COMPANYCD IN (
           SELECT CompanyCd
           FROM T_Keiyaku Kei
           WHERE Kei.KeiyakuNo = T1.KeiyakuNo
        ))
        LEFT JOIN M_SelectItem T8 ON (T1.ColumnOption = T8.selNo AND T8.selType = 16)
        WHERE T1.KeiyakuNo = @KeiyakuNo AND T1.KeiyakuTokuyakuNo = 0;

        SELECT
             T1.KeiyakuTokuyakuNo
            ,T1.KeiyakuNo
            ,T1.CompanyCd
            ,T1.ProductCd
            ,T1.CategoryCd
            ,T1.TokuNo
            ,T1.TokuyakuName
            ,T1.SeqNo
            ,T1.CreateDate
            ,T1.UpdateDate
            ,CONCAT('[', stuff((
                SELECT CONCAT(
                ', {"KeiyakuHoshoNo": ', T2.KeiyakuHoshoNo, 
                ', "HoshoNo": "', T2.HoshoNo, 
                '", "HoshoName": "', T2.HoshoName, 
                '", "ColumnVal": "', T2.ColumnVal, 
                '", "ColumnValText": "', (
                    CASE T2.TypeF
                    WHEN 40 THEN CONCAT(T4.LastName, T4.FirstName)
                    WHEN 70 THEN T5.AgentName
                    WHEN 50 THEN T6.COMPANYNAME
                    WHEN 90 THEN T7.name
                    WHEN 60 THEN T8.PRODUCTNAME
                    WHEN 80 THEN (CASE T2.ColumnVal WHEN NULL THEN T9.name WHEN '' THEN T9.name ELSE CONCAT(T2.ColumnVal, T9.name) END)
                    ELSE T3.name END
                ), 
                '", "Comment": "', T2.Comment, 
                '", "TypeF": "', T2.TypeF, 
                '", "Size": ', T2.Size,
                ', "SelType": ', T2.SelType,
                ', "SeqNo": ', T2.SeqNo,
                ', "ColumnOption": "', T2.ColumnOption,
                '"}')
                FROM T_KeiyakuHosho T2 
                LEFT JOIN M_SelectItem T3 ON (T2.SelType = T3.selType AND T2.ColumnVal = convert(nvarchar(200), T3.selNo))
                LEFT JOIN T_Family T4 ON (T2.ColumnVal = convert(nvarchar(200), T4.FamilyNo))
                LEFT JOIN T_Agent T5 ON (T2.ColumnVal = convert(nvarchar(200), T5.AgentNo))
                LEFT JOIN V_Company T6 ON T2.ColumnVal = T6.COMPANYCD
                LEFT JOIN M_SelectItem T7 ON (T2.ColumnVal = convert(nvarchar(200), T7.selNo) AND T7.selType = 3)
                LEFT JOIN V_Product T8 ON (T2.ColumnVal = T8.PRODUCTCD AND T8.COMPANYCD IN (
                    SELECT CompanyCd
                    FROM T_Keiyaku Kei
                    WHERE Kei.KeiyakuNo = T1.KeiyakuNo
                ))
                LEFT JOIN M_SelectItem T9 ON (T2.ColumnOption = T9.selNo AND T9.selType = 16)
                WHERE T2.KeiyakuNo = @KeiyakuNo AND T2.KeiyakuTokuyakuNo = T1.KeiyakuTokuyakuNo
                FOR XML PATH('')
            ), 1, 1,''), ']') tokuyakuHosho
        FROM T_KeiyakuTokuyaku T1
        WHERE T1.KeiyakuNo = @KeiyakuNo;`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function (res) {
            data.keiyaku = res.recordsets[0][0];
            data.shukeiyaku = res.recordsets[1];
            data.tokuyaku = res.recordsets[2];
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getProductBykeiyakuno" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objParams) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function (err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "getProductBykeiyakuno" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objParams) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch (err) {
        let logData = [
            {key: "Time", content: new Date()},
            {key: "File", content: "T_Keiyaku.js"},
            {key: "Function", content: "getProductBykeiyakuno"},
            {key: "Table", content: T_Table.tableName},
            {key: "Param", content: JSON.stringify(objParams)},
            {key: "Err", content: err}
        ]
        await logService.errorLog(logData);

        return false;
    }
    
    return (data);
}

async function resetRegisteredF(UserNo) {
    let sqlRequest = baseModel.fillData(T_Table, {});
    sqlRequest.input('UserNo', sql.BigInt, UserNo);
    let result;
    try {
        let sqlStr = `UPDATE ${T_Table.tableName} SET registeredF = 0, UpdateDate = getdate() WHERE FamilyNo IN (
            SELECT FamilyNo FROM T_Family WHERE UserNo = @UserNo AND DelF = 0
        )`;

        let query = new Promise(function(resolve, reject){
            sqlRequest.query(sqlStr, function(err, res){
                if(res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            result = true;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "resetRegisteredF" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: UserNo }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "resetRegisteredF" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: UserNo },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
        return result;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Keiyaku.js" },
            { key: "Function", content: "resetRegisteredF" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: UserNo },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return;
    } finally {
        return result;
    }
}

async function requestOCRList(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let yearFrom = 1;
    let monthFrom = 1;
    let monthTo = 1;

    if (!validation.isEmptyObject(objSearch.TaiouJoukyou)) {
        if (objSearch.TaiouJoukyou.indexOf(",0,") >= 0){
            sqlRequest.input("Mi_Taiou", sql.NVarChar(200), T_OCR_TaiouJoukyou.Mi_Taiou);
        }
        if (objSearch.TaiouJoukyou.indexOf(",2,") >= 0){
            sqlRequest.input("Gazo_Hosei", sql.NVarChar(200), T_OCR_TaiouJoukyou.Gazo_Hosei);
        }
        if (objSearch.TaiouJoukyou.indexOf(",1,") >= 0){
            sqlRequest.input("Henkan_Zumi", sql.NVarChar(200), T_OCR_TaiouJoukyou.Henkan_Zumi);
        }
    }
    sqlRequest.input("TitleConst", sql.NVarChar(200), T_OCR_TaiouJoukyou.Title_Const);

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
         T1.KeiyakuNo,
         T1.GroupID,
         T1.FamilyName,
         T1.HihoFamilyName,
         CONCAT(T1.HihoFamilyName , @TitleConst) AS Title,
         T1.NyuryokuF,
         (CASE T1.NyuryokuF WHEN 1 THEN N'変換済' WHEN 0 THEN N'未対応' WHEN 2 THEN N'画像補正' END) TypeName,
         T1.CreateDate,
         T1.UpdateDate,
         T1.DelF,
         (SELECT COUNT(*) FROM T_File WHERE GroupID = T1.GroupID AND DelF = 0) as count_img
         FROM T_Keiyaku T1 WHERE T1.DelF = 0 `;

        if (!validation.isEmptyObject(objSearch.TaiouJoukyou)) {
            let strLogin = "";            
            if (objSearch.TaiouJoukyou.indexOf(",0,") >= 0){
                if (strLogin === "") {
                    strLogin += ` AND (T1.NyuryokuF = @Mi_Taiou`;
                }
                else {
                    strLogin += ` OR T1.NyuryokuF = @Mi_Taiou`;
                }
            }
            if (objSearch.TaiouJoukyou.indexOf(",2,") >= 0){
                if (strLogin === "") {
                    strLogin += ` AND (T1.NyuryokuF = @Gazo_Hosei`;
                }
                else {
                    strLogin += ` OR T1.NyuryokuF = @Gazo_Hosei`;
                }
            }
            if (objSearch.TaiouJoukyou.indexOf(",1,") >= 0){
                if (strLogin === "") {
                    strLogin += ` AND (T1.NyuryokuF = @Henkan_Zumi`;
                }
                else {
                    strLogin += ` OR T1.NyuryokuF = @Henkan_Zumi`;
                }
            }
            if (strLogin!="") {
                strLogin+=")";
            }
            sqlStr += strLogin;
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

        let sqlCount = `SELECT COUNT(A.KeiyakuNo) row_count FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter + ";"
        sqlStr = `WITH query AS (SELECT ROW_NUMBER() OVER(` + orderStr + `) AS line, * FROM (` + sqlStr + `) A WHERE 1 = 1` + strFilter +`) SELECT TOP (@PageSize) * FROM query WHERE line > (@Page - 1) * @PageSize;`;
        sqlStr += sqlCount;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {            
            dataReturn = res.recordsets[0];
            totalRecord = res.recordsets[1][0].row_count;
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "requestOCRList" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "requestOCRList" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Keiyaku.js" },
            { key: "Function", content: "requestOCRList" },
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

async function deleteOCRList(objSearch) {
    var rowsAffected;
    let sqlRequest = baseModel.fillData(T_Table, objSearch);    
    if (!validation.isEmptyObject(objSearch.KeiyakuNo)) {
        sqlRequest.input("KeiyakuNo", sql.BigInt, objSearch.KeiyakuNo);
    }
    try {
        let sqlStr = `UPDATE T_Keiyaku SET DelF=1 WHERE KeiyakuNo=@KeiyakuNo`;
        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            rowsAffected = res.rowsAffected[0];
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "deleteOCRList" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Keiyaku.js" },
                { key: "Function", content: "deleteOCRList" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Keiyaku.js" },
            { key: "Function", content: "deleteOCRList" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);
        
        return false;
    }
    
    return (rowsAffected);
}
//#endregion

module.exports = {
    getListKeiyaku,
    getKeiyakuByUser,
    getDetailKeiyaku,
    createKeiyaku,
    updateKeiyaku,
    deleteKeiyaku,
    updateKaniShindanF,
    getListProductByUser,
    getProductDetail,
    resetRegisteredF,
    getProductByKeiyakuno,
    requestOCRList,
    deleteOCRList
}
