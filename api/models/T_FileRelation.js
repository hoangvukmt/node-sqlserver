'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_FileRelation",
    columns: [
        { key: "RelationID", type: sql.BigInt(19), isPk: true, defaultValue: null },
        { key: "UserNo", type: sql.BigInt(19), isPk: false, defaultValue: null },
        { key: "FilePath", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "FileName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "MenuFileName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "DelF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getListFileRelation(objSearch) {
    return baseModel.searchData(T_Table, objSearch, [{ key: "RelationID", type: "ASC" }]);
}

//#region only kanri -------------------------------------------------------------------------------------
async function createFile(data) {
    return baseModel.createNew(T_Table, data);
}

async function kanriDeleteFileRelation(objSearch) {
    let objDataUpdate = {
        DelF: 1,
        notLog: true
    }
    let objCondition = {
        UserNo: objSearch.UserNo,
        FileName: objSearch.FileName
    }
    return baseModel.updateByCondition(T_Table, objDataUpdate, objCondition);
}
//#endregion

module.exports = {
    getListFileRelation,
    createFile,
    kanriDeleteFileRelation
};