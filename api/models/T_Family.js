'use strict';
const baseModel = require('../base/BaseModel');
const logService = require('../services/LogService');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_Family",
    columns: [
        { key: "FamilyNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "UserNo", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "LastName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "FirstName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "Relation", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "Sex", type: sql.Char(1), isPk: false, defaultValue: null },
        { key: "Birthday", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "SeqNo", type: sql.Int, isPk: false, defaultValue: 0 },
        { key: "DelF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "IqCustomerNo", type: sql.BigInt(8), isPk: false, defaultValue: 0 },
        { key: "IqFamilyNo", type: sql.Int(4), isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function asyncGetFamilybyUser(user) {
    let sqlRequest = baseModel.fillData(T_Table, user);
    let family;
    try {
        let sqlStr = `SELECT * FROM ${T_Table.tableName} WHERE UserNo = @UserNo AND DelF = 0 ORDER BY Relation`;
        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            family = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "asyncGetFamilybyUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(user) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "asyncGetFamilybyUser" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(user) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Family.js" },
            { key: "Function", content: "asyncGetFamilybyUser" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(user) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    return family;
}

async function getInfobyFamilyNo(familyNo) {
    let tmpFamily = {
        FamilyNo: familyNo
    }
    let family;
    let sqlRequest = baseModel.fillData(T_Table, tmpFamily);
    try {
        let sqlStr = `SELECT
         T1.FamilyNo
        ,T1.UserNo
        ,T1.LastName
        ,T1.FirstName
        ,T1.Relation
        ,T1.Sex
        ,T1.Birthday
        ,T1.SeqNo
        ,T1.DelF
        ,T1.IqCustomerNo
        ,T1.IqFamilyNo
        ,T1.CreateDate
        ,T1.UpdateDate
        ,T2.KaniShindanF
        ,T2.ShokenBunsekiF
        FROM T_Family T1 LEFT JOIN T_User T2 ON T1.UserNo = T2.UserNo AND T2.DelF = 0
        WHERE T1.FamilyNo = @FamilyNo`;
        let query = new Promise(function(resolve, reject){
            sqlRequest.query(sqlStr, function(err, res){
                if(res) {
                    resolve(res.recordset.length > 0 ? res.recordset[0] : null);
                } else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            family = res;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "getInfobyFamilyNo" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: familyNo }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "getInfobyFamilyNo" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: familyNo },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        })
        return family;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Family.js" },
            { key: "Function", content: "getInfobyFamilyNo" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: familyNo },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return;
    } finally {
        return family;
    }
}

async function asyncCreateFamily(family) {
    let sqlRequest = baseModel.fillData(T_Table, family);
    let result;
    try{
        let sqlStr = `INSERT INTO ${T_Table.tableName} (
            UserNo, LastName, FirstName, Relation, Sex, Birthday, SeqNo, DelF
        ) VALUES (
            @UserNo,
            @LastName,
            @FirstName,
            @Relation,
            @Sex,
            @Birthday,
            @SeqNo,
            0
        ) SELECT SCOPE_IDENTITY() as id`;
        let query = new Promise(function(resolve, reject){
            sqlRequest.query(sqlStr, function(err, res){
                if(res) {
                    resolve(res);
                }else {
                    reject(err);
                }
            });
        });
        await query.then(async function(res) {
            result = res.recordset.length > 0 ? res.recordset[0] : null;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "asyncCreateFamily" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(family) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "asyncCreateFamily" },
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
            { key: "File", content: "T_Family.js" },
            { key: "Function", content: "asyncCreateFamily" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(family) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
}

async function asyncUpdateFamily(family) {
    let updateFamily = await getInfobyFamilyNo(family.FamilyNo);
    if(!updateFamily) {
        return;
    }
    let sqlRequest = baseModel.fillData(T_Table, family);
    let result;
    try {
        let sqlStr = `UPDATE ${T_Table.tableName} SET 
        UserNo = @UserNo,
        LastName = @LastName,
        FirstName = @FirstName, 
        Relation = @Relation, 
        Sex = @Sex, 
        Birthday = @Birthday, 
        SeqNo = @SeqNo, 
        UpdateDate = getdate() 
        WHERE FamilyNo = @FamilyNo`;

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
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "asyncUpdateFamily" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(family) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "asyncUpdateFamily" },
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
            { key: "File", content: "T_Family.js" },
            { key: "Function", content: "asyncUpdateFamily" },
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

async function deleteFamily(objSearch) {
    let objDataUpdate = {
        FamilyNo: objSearch.FamilyNo,
        DelF: 1
    }
    return baseModel.updateById(T_Table, objDataUpdate);
}

async function getListFamily(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         T1.FamilyNo
        ,T1.UserNo
        ,T1.LastName
        ,T1.FirstName
        ,T1.Relation
        ,T1.Sex
        ,T1.Birthday
        ,T1.SeqNo
        ,T1.DelF
        ,T1.CreateDate
        ,T1.UpdateDate
        ,T2.name RelationName
        ,T3.HokenShokenF
        FROM T_Family T1 INNER JOIN M_SelectItem T2 ON T1.Relation = T2.selNo AND T2.selType = 5 
        LEFT JOIN T_User T3 ON T1.UserNo = T3.UserNo
        WHERE T1.UserNo = @UserNo AND T1.DelF = 0 ORDER BY T1.Relation`;
        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "getListFamily" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_Family.js" },
                { key: "Function", content: "getListFamily" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_Family.js" },
            { key: "Function", content: "getListFamily" },
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
    asyncGetFamilybyUser,
    getInfobyFamilyNo,
    asyncCreateFamily,
    asyncUpdateFamily,
    deleteFamily,
    getListFamily
}