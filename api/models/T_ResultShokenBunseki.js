'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_ResultShokenBunseki",
    columns: [
        { key: "UserNo", type: sql.BigInt(19), isPk: false, defaultValue: null },
        { key: "MessageNo", type: sql.BigInt(19), isPk: false, defaultValue: null },
        { key: "ResultPath", type: sql.VarChar(200), isPk: false, defaultValue: null },
        { key: "TantoName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getListShokenBunseki(objSearch) {
    return baseModel.searchData(T_Table, objSearch, [{ key: "CreateDate", type: "ASC" }]);
}

//#region only kanri -------------------------------------------------------------------------------------
async function createNew(data) {
    return baseModel.createNew(T_Table, data);
}
//#endregion

module.exports = {
    getListShokenBunseki,
    createNew
}