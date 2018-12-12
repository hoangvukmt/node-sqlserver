'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_Agent",
    columns: [
        { key: "AgentNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "UserNo", type: sql.BigInt(8), isPk: false, defaultValue: 0 },
        { key: "AgentName", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "TantoName", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "Phone", type: sql.VarChar(20), isPk: false, defaultValue: null },
        { key: "KeiyakuPage", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "Remarks", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "DelF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getListAgent(objSearch) {
    return baseModel.searchData(T_Table, objSearch, []);
}

async function createAgent(data) {
    return baseModel.createNewGetId(T_Table, data);
}

async function getInfoAgent(objSearch) {
    return baseModel.getDetailByID(T_Table, objSearch.AgentNo);
}

async function deleteAgent(data) {
    let dataDelete = {
        AgentNo: data.AgentNo,
        DelF: 1
    };
    return baseModel.updateById(T_Table, dataDelete);
}

async function updateAgent(data) {
    return baseModel.updateById(T_Table, data);
}

module.exports = {
    getListAgent,
    createAgent,
    getInfoAgent,
    deleteAgent,
    updateAgent
}