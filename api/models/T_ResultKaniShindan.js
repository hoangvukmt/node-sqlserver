'use strict';
const baseModel = require('../base/BaseModel');
const validation = require('../util/validation');
const logService = require('../services/LogService');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_ResultKaniShindan",
    columns: [
        { key: "FamilyNo", type: sql.BigInt(19), isPk: false, defaultValue: null },
        { key: "UserNo", type: sql.BigInt(19), isPk: false, defaultValue: null },
        { key: "IsshogaiHoshoF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "ItteiKikanHoshoF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "FamilyShunyuF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "SickF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "GanF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "ShippeiF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "ShugyoFunoF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "KaigoF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "EducationFundF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "RogoF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "KegaF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "CarF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "BicycleF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "KasaiF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "JishinF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "LiabilityF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "PetF", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "TantoName", type: sql.NVarChar(100), isPk: false, defaultValue: "オペレータA" },
        { key: "Message", type: sql.NVarChar(4000), isPk: false, defaultValue: null },
        { key: "Status", type: sql.TinyInt(1), isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getKaniShindanInfo(objSearch) {
    let sqlRequest = baseModel.fillData(T_Table, objSearch);
    let data;
    try {
        let sqlStr = `SELECT
         T2.FamilyNo
        ,T1.UserNo
        ,T1.IsshogaiHoshoF
        ,T1.ItteiKikanHoshoF
        ,T1.FamilyShunyuF
        ,T1.SickF
        ,T1.GanF
        ,T1.ShippeiF
        ,T1.ShugyoFunoF
        ,T1.KaigoF
        ,T1.EducationFundF
        ,T1.RogoF
        ,T1.KegaF
        ,T1.CarF
        ,T1.BicycleF
        ,T1.KasaiF
        ,T1.JishinF
        ,T1.LiabilityF
        ,T1.PetF
        ,T1.TantoName
        ,T1.Message
        ,T1.Status
        ,T2.LastName
        ,T2.FirstName
        ,TU.KaniShindanF 
        FROM T_ResultKaniShindan T1 
        LEFT JOIN T_User TU ON TU.UserNo = T1.UserNo
        RIGHT JOIN T_Family T2 ON T1.FamilyNo = T2.FamilyNo WHERE 1 = 1`;


        if (!validation.isEmptyObject(objSearch.UserNo)) {
            sqlStr += ` AND T2.UserNo = @UserNo`;
        }
        sqlStr += ` AND T2.DelF = 0`;

        let query = sqlRequest.query(sqlStr);
        await query.then(async function(res) {
            data = res.recordset;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_ResultKaniShindan.js" },
                { key: "Function", content: "getKaniShindanInfo" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "T_ResultKaniShindan.js" },
                { key: "Function", content: "getKaniShindanInfo" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "T_ResultKaniShindan.js" },
            { key: "Function", content: "getKaniShindanInfo" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    
    return data;
}

async function createResultKaniShindan(data) {
    return baseModel.createNew(T_Table, data);
}

async function searchData(objSearch) {
    return baseModel.searchData(T_Table, objSearch, []);
}

async function updateData(objData, objCondition) {
    return baseModel.updateByCondition(T_Table, objData, objCondition);
}

module.exports = {
    getKaniShindanInfo,
    createResultKaniShindan,
    searchData,
    updateData
}