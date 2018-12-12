'use strict';
const baseModel = require('../base/BaseModel');
const validation = require('../util/validation');

const sql = baseModel.sql;
const T_Table = {
    tableName: "M_SelectItem",
    columns: [
        { key: "selType", type: sql.Int, isPk: false, defaultValue: null },
        { key: "selNo", type: sql.Int, isPk: false, defaultValue: null },
        { key: "name", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "nameS", type: sql.NVarChar(10), isPk: false, defaultValue: null },
        { key: "seqNo", type: sql.Int, isPk: false, defaultValue: null },
        { key: "remarks", type: sql.NVarChar(50), isPk: false, defaultValue: null },
        { key: "reserve", type: sql.NVarChar(100), isPk: false, defaultValue: null },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};

async function getListSelectItem(objSearch) {
    return baseModel.searchData(T_Table, objSearch, [{ key: "seqNo", type: "ASC" }]);
}

module.exports = {
    getListSelectItem
}