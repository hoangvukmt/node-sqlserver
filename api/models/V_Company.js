'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "V_Company",
    columns: [
        { key: "COMPANYCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "COMPANYNAME", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "REGISTRYF", type: sql.Char(1), isPk: false, defaultValue: null },
        { key: "TantoName", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "Phone", type: sql.VarChar(20), isPk: false, defaultValue: null },
        { key: "URL", type: sql.VarChar(200), isPk: false, defaultValue: null },
        { key: "Memo", type: sql.NVarChar(200), isPk: false, defaultValue: null }
    ]
};

async function getListCompany(objSearch) {
    return baseModel.searchData(T_Table, objSearch, []);
}

module.exports = {
    getListCompany
}