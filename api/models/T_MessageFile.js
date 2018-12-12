'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_MessageFile",
    columns: [
        { key: "FileID", type: sql.BigInt(19), isPk: true, defaultValue: null },
        { key: "MessageNo", type: sql.BigInt(19), isPk: false, defaultValue: null },
        { key: "FilePath", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "FileName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "MenuFileName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "DelF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

//#region only kanri -------------------------------------------------------------------------------------
async function createFile(data) {
    return baseModel.createNew(T_Table, data);
}

async function getFileDetail(objSearch) {
    return baseModel.getDetailByID(T_Table, objSearch.FileID);
}
//#endregion

module.exports = {
    createFile,
    getFileDetail
};