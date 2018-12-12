'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_IQAdd",
    columns: [
        { key: "RenkeiNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "UserNo", type: sql.BigInt, isPk: false, defaultValue: null },
        { key: "BranchCd", type: sql.Char(7), isPk: false, defaultValue: null },
        { key: "ClerkCd", type: sql.Char(6), isPk: false, defaultValue: null },
        { key: "UserId", type: sql.VarChar(20), isPk: false, defaultValue: null },
        { key: "IqCustomerNo", type: sql.BigInt, isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

//#region only kanri -------------------------------------------------------------------------------------
async function createNew(data) {
    return baseModel.createNew(T_Table, data);
}
//#endregion

module.exports = {
    createNew
}