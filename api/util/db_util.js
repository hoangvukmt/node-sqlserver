'use_strict';

const systemConfig = require('config');
const sql = require('mssql');
let initialized = false;
let sqlConnect = null;

module.exports = {
    sql,
    sqlConnect,
    dbConnect
}

async function dbConnect () {
    let sqlConfig = systemConfig.get("TestENV.dbConfig");
    // add encrypt = false for connect to test env - not azure
    sqlConfig.options = {
        "encrypt": false
    }
    try{
        sqlConnect = await new sql.connect(sqlConfig);
    } catch (err) {
        return false;
    }
    return sql;
}
