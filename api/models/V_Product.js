'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "V_Product",
    columns: [
        { key: "COMPANYCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "PRODUCTCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "PRODUCTNAME", type: sql.NVarChar(400), isPk: false, defaultValue: null },
        { key: "CATEGORYCD", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "DelF", type: sql.TinyInt, isPk: false, defaultValue: 0 }
    ]
};

async function getListProduct(objSearch) {
    return baseModel.searchData(T_Table, objSearch, []);
}

module.exports = {
    getListProduct
}