'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "V_Agent",
    columns: [
        { key: "AgentCd", type: sql.Char(5), isPk: true, defaultValue: null },
        { key: "AgentName", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "TantoName", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "Phone", type: sql.VarChar(20), isPk: false, defaultValue: null },
        { key: "KeiyakuPage", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "KaniShindanUseF", type: sql.TinyInt, isPk: false, defaultValue: 0 },
        { key: "ShokenBunsekiUseF", type: sql.TinyInt, isPk: false, defaultValue: 0 },
        { key: "KeiyakuPageUseF", type: sql.TinyInt, isPk: false, defaultValue: 0 },
    ]
};

async function getDetailAgent(objSearch) {
    return baseModel.getDetailByID(T_Table, objSearch.AgentCd);
}

async function createAgent(data) {
    return baseModel.createNew(T_Table, data);
}

//#region only kanri -------------------------------------------------------------------------------------
async function searchData(objSearch) {
    return baseModel.searchData(T_Table, objSearch, []);
}
//#endregion

module.exports = {
    getDetailAgent,
    createAgent,
    searchData
}