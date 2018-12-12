'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "T_Area",
    columns: [
        { key: "AreaID", type: sql.Int, isPk: false, defaultValue: null },
        { key: "GroupID", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "FileID", type: sql.Int, isPk: false, defaultValue: null },
        { key: "UpLeftX", type: sql.Int, isPk: false, defaultValue: null },
        { key: "UpLeftY", type: sql.Int, isPk: false, defaultValue: null },
        { key: "UpRightX", type: sql.Int, isPk: false, defaultValue: null },
        { key: "UpRightY", type: sql.Int, isPk: false, defaultValue: null },
        { key: "BottomLeftX", type: sql.Int, isPk: false, defaultValue: null },
        { key: "BottomLeftY", type: sql.Int, isPk: false, defaultValue: null },
        { key: "BottomRightX", type: sql.Int, isPk: false, defaultValue: null },
        { key: "BottomRightY", type: sql.Int, isPk: false, defaultValue: null },
        { key: "DelF", type: sql.Bit, isPk: false, defaultValue: 0 },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" },
        { key: "Rotate", type: sql.Float, isPk: false, defaultValue: null }
    ]
};

async function getListArea(objSearch) {
    return baseModel.searchData(T_Table, objSearch, []);
}

async function createArea(data) {
    return baseModel.createNew(T_Table, data);
}

module.exports = {
    getListArea,
    createArea
}