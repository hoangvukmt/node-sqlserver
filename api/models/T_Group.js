'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_Group",
    columns: [
        { key: "GroupID", type: sql.BigInt(19), isPk: true, defaultValue: null },
        { key: "FamilyNo", type: sql.BigInt(19), isPk: false, defaultValue: 0 },
        { key: "hihoFamilyNo", type: sql.BigInt(19), isPk: false, defaultValue: 0 },
        { key: "FilePath", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "FileName", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "AutoF", type: sql.TinyInt(3), isPk: false, defaultValue: 0 },
        { key: "Status", type: sql.TinyInt(3), isPk: false, defaultValue: 0 },
        { key: "DelF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function createGroup(data) {
    return baseModel.createNewGetId(T_Table, data);
}

async function updateGroup(data) {
    return baseModel.updateById(T_Table, data);
}

async function getInfoGroup(objSearch) {
    return baseModel.getDetailByID(T_Table, objSearch.GroupID);
}

module.exports = {
    createGroup,
    updateGroup,
    getInfoGroup
}