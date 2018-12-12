'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_KeiyakuTokuyaku",
    columns: [
        { key: "KeiyakuTokuyakuNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "KeiyakuNo", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "CompanyCd", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "ProductCd", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "CategoryCd", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "TokuNo", type: sql.Int(4), isPk: false, defaultValue: null },
        { key: "TokuyakuName", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "SeqNo", type: sql.Int(4), isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getListKeiyakuTokuyaku(objSearch) {
    return baseModel.searchData(T_Table, objSearch, [{ key: "SeqNo", type: "ASC" }]);
}

async function getDetailKeiyakuTokuyaku(objSearch) {
    return baseModel.getDetailByID(T_Table, objSearch.KeiyakuTokuyakuNo);
}

async function createKeiyakuTokuyaku(data) {
    return baseModel.createNewGetId(T_Table, data);
}

async function updateKeiyakuTokuyaku(data) {
    return baseModel.updateById(T_Table, data);
}

async function deleteKeiyakuTokuyaku(data) {
    return baseModel.deleteData(T_Table, data);
}

module.exports = {
    getListKeiyakuTokuyaku,
    getDetailKeiyakuTokuyaku,
    createKeiyakuTokuyaku,
    updateKeiyakuTokuyaku,
    deleteKeiyakuTokuyaku
}