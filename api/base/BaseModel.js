'use strict';
const logService = require('../services/LogService');
const validation = require('../util/validation');
const common = require('../util/common');
const DB = require('../util/db_util');
const sql = DB.sql;

const T_Riyo = {
    tableName: "T_Riyo",
    columns: [
        { key: "RiyoNo", type: sql.BigInt(8), isPk: true, defaultValue: null },
        { key: "UserNo", type: sql.BigInt(8), isPk: false, defaultValue: null },
        { key: "ActionCode", type: sql.TinyInt, isPk: false, defaultValue: 0 },
        { key: "ActionContent", type: sql.NVarChar(200), isPk: false, defaultValue: null },
        { key: "CreateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()" },
        { key: "UpdateDate", type: sql.DateTime, isPk: false, defaultValue: "getdate()", defaultUpdate: "getdate()" }
    ]
};
const logContent = {
    HokenBunseki_Kaishi: '保険分析サービス開始',//1
    Login: 'ログイン',//2
    ChangePass: 'パスワード更新',//3
    ReSendPass: 'パスワード忘れ依頼',//4
    RegistFamily: '家族情報登録',//5
    InsertFamily: '家族情報追加',//6
    ChangeFamily: '家族情報更新',//7
    DeleteFamily: '家族情報削除',//8
    RequestInquiry: 'お問合せ依頼',//9
    RequestDiagnostic: '簡易診断依頼',//10
    RequestTrailAnalysis: 'お試し分析依頼',//11
    RequestAutoInput: '保険証券自動入力依頼',//12
    AddHoken: '保険証券登録',//13
    ChangeHoken: '保険証券更新',//14
    DeleteHoken: '保険証券削除',//15
    AddHokenImage: '保険証券画像追加',//16
    ClickBaner: 'バナー呼出「<バナーNo>」',//17
    AddAgent: '保険代理店登録',//18
    ChangeAgent: '保険代理店更新',//19
    DeleteAgent: '保険代理店削除'//20
}

const orderWhiteList = ["asc", "desc", null];
const operatorWhiteList = ["AND", "OR"];
const conditionWhiteList = [
    "equals", 
    "notEqual", 
    "startsWith", 
    "endsWith", 
    "contains", 
    "notContains", 
    "lessThan", 
    "lessThanOrEqual", 
    "greaterThan",
    "greaterThanOrEqual",
    "inRange"
];

function fillData(T_Table, data) {
    var sqlRequest = new sql.Request();
    for (var i = 0; i < T_Table.columns.length; i++) { 
        var item = T_Table.columns[i];
        if (typeof data[item.key] !== "undefined") {
            sqlRequest.input(item.key, item.type, data[item.key]);
        }
    }
    return sqlRequest;
}

// Insert data to table
async function createNew(T_Table, data, logContent) {
    let sqlRequest = this.fillData(T_Table, data);

    let strField = "";
    let strParam = "";
    for (var i = 0; i < T_Table.columns.length; i++) { 
        var item = T_Table.columns[i];
        if (typeof data[item.key] !== "undefined" && !item.isPk) {
            strField += "[" + item.key + "],"
            strParam += "@" + item.key + ","
        }
        else {
            if (item.defaultValue !== null && !item.isPk) {
                strField += "[" + item.key + "],"
                if (item.defaultValue.toString().indexOf('()') >= 0) {
                    strParam += item.defaultValue + ","
                }
                else {
                    strParam += "@" + item.key + ","
                    sqlRequest.input(item.key, item.type, item.defaultValue);
                }
            }
        }
    }
    if (strField.length > 0) {
        strField = strField.substr(0, strField.length - 1);
        strParam = strParam.substr(0, strParam.length - 1);
    }
    
    let result;
    try {
        let sqlStr = `INSERT INTO ${T_Table.tableName} (${strField}) VALUES (${strParam})`;
        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if (res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
        let _this = this;
        await query.then(async function(res) {
            result = true;

            if (logContent) {
                _this.writeLog(logContent);
            }

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "createNew" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "createNew" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
        return result;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "BaseModel.js" },
            { key: "Function", content: "createNew" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
}

// Insert data to table and return id inserted
async function createNewGetId(T_Table, data, logContent) {
    let sqlRequest = this.fillData(T_Table, data);

    let strField = "";
    let strParam = "";
    for (var i = 0; i < T_Table.columns.length; i++) { 
        var item = T_Table.columns[i];
        if (typeof data[item.key] !== "undefined" && !item.isPk) {
            strField += "[" + item.key + "],"
            strParam += "@" + item.key + ","
        }
        else {
            if (item.defaultValue !== null && !item.isPk) {
                strField += "[" + item.key + "],"
                if (item.defaultValue.toString().indexOf('()') >= 0) {
                    strParam += item.defaultValue + ","
                }
                else {
                    strParam += "@" + item.key + ","
                    sqlRequest.input(item.key, item.type, item.defaultValue);
                }
            }
        }
    }
    if (strField.length > 0) {
        strField = strField.substr(0, strField.length - 1);
        strParam = strParam.substr(0, strParam.length - 1);
    }

    let result;
    try {
        let sqlStr = `INSERT INTO ${T_Table.tableName} (${strField}) VALUES (${strParam}) SELECT SCOPE_IDENTITY() as id`;
        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if (res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
        let _this = this;
        await query.then(async function(res) {
            result = res.recordset.length > 0 ? res.recordset[0] : null;

            if (logContent) {
                _this.writeLog(logContent);
            }

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "createNewGetId" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "createNewGetId" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
        return result;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "BaseModel.js" },
            { key: "Function", content: "createNewGetId" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
}

// Update data by ID
async function updateById(T_Table, data, logContent) {
    let fieldPk = "";
    let strFieldUpdate = "";
    let pkValue;
    for (var i = 0; i < T_Table.columns.length; i++) { 
        var item = T_Table.columns[i];
        if (item.isPk) {
            fieldPk = item.key;
            pkValue = data[item.key];
        }

        if (typeof data[item.key] !== "undefined" && !item.isPk) {
            strFieldUpdate +=  `[${item.key}] = @${item.key},`;
        }
        else {
            if (typeof item.defaultUpdate !== "undefined" && item.defaultUpdate !== 'none' && !item.isPk) {
                strFieldUpdate += `[${item.key}] = ${item.defaultUpdate},`;
            }
        }
    }

    let objUpdate = await this.getDetailByID(T_Table, pkValue);
    if (!objUpdate) {
        return false;
    }

    if (strFieldUpdate.length > 0) {
        strFieldUpdate = strFieldUpdate.substr(0, strFieldUpdate.length - 1);
    }

    let sqlRequest = this.fillData(T_Table, data);
    let result;
    try {
        let sqlStr = `UPDATE ${T_Table.tableName} SET ${strFieldUpdate} WHERE [${fieldPk}] = @${fieldPk}`;
        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if (res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
        let _this = this;
        await query.then(async function(res) {
            result = true;

            if (logContent) {
                _this.writeLog(logContent);
            }

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "updateById" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "updateById" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
        return result;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "BaseModel.js" },
            { key: "Function", content: "updateById" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
}

// Update data by other condition
async function updateByCondition(T_Table, data, objCondition, logContent) {
    let sqlRequest = this.fillData(T_Table, objCondition);

    let strFieldUpdate = "";
    let strWhere = "";
    for (var i = 0; i < T_Table.columns.length; i++) { 
        var item = T_Table.columns[i];

        if (typeof data[item.key] !== "undefined" && !item.isPk) {
            strFieldUpdate +=  `[${item.key}] = @${item.key},`;
            sqlRequest.input(item.key, item.type, data[item.key]);
        }
        else {
            if (typeof item.defaultUpdate !== "undefined" && item.defaultUpdate !== 'none' && !item.isPk) {
                strFieldUpdate += `[${item.key}] = ${item.defaultUpdate},`;
            }
        }

        if (typeof objCondition[item.key] !== "undefined") {
            strWhere += ` AND [${item.key}] = @${item.key}`;
        }
    }

    if (strFieldUpdate.length > 0) {
        strFieldUpdate = strFieldUpdate.substr(0, strFieldUpdate.length - 1);
    }
    if (strWhere.length > 0) {
        strWhere = strWhere.substr(5, strWhere.length);
    }
    let result;
    try {
        let sqlStr = `UPDATE ${T_Table.tableName} SET ${strFieldUpdate} WHERE ${strWhere}`;
        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if (res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
        let _this = this;
        await query.then(async function(res) {
            result = true;
            
            if (logContent) {
                _this.writeLog(logContent);
            }

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "updateByCondition" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "updateByCondition" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
        return result;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "BaseModel.js" },
            { key: "Function", content: "updateByCondition" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
}

// Get detail by ID
async function getDetailByID(T_Table, id, logContent) {
    let data;
    let sqlRequest = new sql.Request();
    try {
        let strField = "";
        let fieldPk = "";
        for (var i = 0; i < T_Table.columns.length; i++) { 
            var item = T_Table.columns[i];
            strField += "[" + item.key + "],"
            if (item.isPk) {
                fieldPk = item.key;
                sqlRequest.input(item.key, item.type, id);
            }
        }
        if (strField.length > 0) {
            strField = strField.substr(0, strField.length - 1);
        }

        let sqlStr = `SELECT ${strField} FROM ${T_Table.tableName} WHERE [${fieldPk}] = @${fieldPk}`;
        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if (res) {
                    resolve(res.recordset.length > 0 ? res.recordset[0] : null);
                } else {
                    reject(err);
                }
            });
        });
        let _this = this;
        await query.then(async function(res) {
            data = res;

            if (logContent) {
                _this.writeLog(logContent);
            }

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "getDetailByID" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: id }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "getDetailByID" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: id },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        })
        return data;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "BaseModel.js" },
            { key: "Function", content: "getDetailByID" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: id },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
}

// Search data
async function searchData(T_Table, objSearch, orders, otherCondition, logContent) {
    let sqlRequest = this.fillData(T_Table, objSearch);
    let data;
    try {
        let strField = "";
        let strWhere = "";
        for (var i = 0; i < T_Table.columns.length; i++) { 
            var item = T_Table.columns[i];
            strField += "[" + item.key + "],"

            if (!validation.isEmptyObject(objSearch[item.key])) {
                if (typeof objSearch.operatorCondition !== "undefined" && objSearch.operatorCondition.length > 0) {
                    let strCondition = "";
                    for (var j = 0; j < objSearch.operatorCondition.length; j++) {
                        var operator = objSearch.operatorCondition[j];
                        if (operator.key === item.key) {
                            strCondition = operator.operator;
                            break;
                        }
                    }
                    if (strCondition !== "") {
                        strWhere += ` AND [${item.key}] ${strCondition} @${item.key}`;
                    }
                    else {
                        strWhere += ` AND [${item.key}] = @${item.key}`;
                    }
                }
                else {
                    strWhere += ` AND [${item.key}] = @${item.key}`;
                }
            }
        }
        if (strField.length > 0) {
            strField = strField.substr(0, strField.length - 1);
        }
        let strOrder = "";
        if (orders.length > 0) {
            strOrder += " ORDER BY ";
            for (var i = 0; i < orders.length; i++) {
                var order = orders[i];
                strOrder += "[" + order.key + "] " + order.type + ",";
            }
        }
        if (strOrder.length > 0) {
            strOrder = strOrder.substr(0, strOrder.length - 1);
        }

        let sqlStr = `SELECT ${strField} FROM ${T_Table.tableName} WHERE 1 = 1${strWhere}${strOrder}`;
        if (otherCondition) {
            sqlStr += otherCondition;
        }
        let query = sqlRequest.query(sqlStr);
        let _this = this;
        await query.then(async function(res) {
            data = res.recordset;

            if (logContent) {
                _this.writeLog(logContent);
            }

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "searchData" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "searchData" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(objSearch) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "BaseModel.js" },
            { key: "Function", content: "searchData" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(objSearch) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
    
    return data;
}

// Delete by condition
async function deleteData(T_Table, data, logContent) {
    let strWhere = "";
    for (var i = 0; i < T_Table.columns.length; i++) { 
        var item = T_Table.columns[i];

        if (typeof data[item.key] !== "undefined") {
            strWhere += ` AND [${item.key}] = @${item.key}`;
        }
    }

    if (strWhere.length > 0) {
        strWhere = strWhere.substr(5, strWhere.length);
    }

    let sqlRequest = this.fillData(T_Table, data);
    let result;
    try {
        let sqlStr = `DELETE FROM ${T_Table.tableName} WHERE ${strWhere}`;
        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if (res) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
        let _this = this;
        await query.then(async function(res) {
            result = true;
            
            if (logContent) {
                _this.writeLog(logContent);
            }

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "deleteData" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) }
            ]
            await logService.sqlLog(logData);
        }).catch(async function(err) {
            result = false;

            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "BaseModel.js" },
                { key: "Function", content: "deleteData" },
                { key: "Sql", content: sqlStr },
                { key: "Param", content: JSON.stringify(data) },
                { key: "Err", content: err }
            ]
            await logService.errorLog(logData);
        });
        return result;
    } catch(err) {
        let logData = [
            { key: "Time", content: new Date() },
            { key: "File", content: "BaseModel.js" },
            { key: "Function", content: "deleteData" },
            { key: "Table", content: T_Table.tableName },
            { key: "Param", content: JSON.stringify(data) },
            { key: "Err", content: err }
        ]
        await logService.errorLog(logData);

        return false;
    }
}

// Build filter condition
async function buildFilter(objSearch, fieldWhiteList, sqlRequest) {
    let sqlStr = ``;
    if (objSearch.Filter.length > 0) {
        for (let i = 0; i < objSearch.Filter.length; i++) {
            let item = objSearch.Filter[i];

            if (!validation.isEmptyObject(item.value1)) {
                let fieldFilterIndex = fieldWhiteList.indexOf(item.field);
                let operatorIndex = operatorWhiteList.indexOf(item.operator);
                let condition1Index = conditionWhiteList.indexOf(item.condition1);
                let condition2Index = conditionWhiteList.indexOf(item.condition2);
                if (fieldFilterIndex >= 0 && operatorIndex >= 0) {
                    if (!validation.isEmptyObject(item.value2)) {
                        if (condition1Index >= 0 && condition2Index >= 0) {
                            let sqlType = sql.NVarChar;
                            let paramValue1 = item.value1;
                            let paramValue1Range1;
                            let paramValue1Range2;
                            let paramValue2 = item.value2;
                            let paramValue2Range1;
                            let paramValue2Range2;

                            if (conditionWhiteList[condition1Index] !== "inRange") {
                                if (item.type === "date" || item.type === "time") {
                                    sqlStr += ` AND (cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime)`;
                                }
                                else if (item.type === "number") {
                                    sqlStr += ` AND (` + fieldWhiteList[fieldFilterIndex];
                                }
                                else {
                                    switch (conditionWhiteList[condition1Index]) {
                                        case "startsWith":
                                            sqlStr += ` AND (UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "endsWith":
                                            sqlStr += ` AND (UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "contains":
                                            sqlStr += ` AND (UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "notContains":
                                            sqlStr += ` AND (UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        default:
                                            sqlStr += ` AND (` + fieldWhiteList[fieldFilterIndex];
                                            break;
                                    }
                                }
                                
                                if (item.type === "number") {
                                    sqlType = sql.Float;
                                    paramValue1 = parseFloat(item.value1);
                                }
                                else {
                                    paramValue1 = item.value1;
                                }
                            }
                            else {
                                sqlStr += ` AND (`;
                                if (item.type === "number") {
                                    sqlType = sql.Float;
                                    if (!validation.isEmptyObject(item.value1[0])) {
                                        paramValue1Range1 = parseFloat(item.value1[0]);
                                    }
                                    else {
                                        return ``;
                                    }
                                    if (!validation.isEmptyObject(item.value1[1])) {
                                        paramValue1Range2 = parseFloat(item.value1[1]);
                                    }
                                }
                                else {
                                    if (!validation.isEmptyObject(item.value1[0])) {
                                        paramValue1Range1 = item.value1[0];
                                    }
                                    else {
                                        return ``;
                                    }
                                    if (!validation.isEmptyObject(item.value1[1])) {
                                        paramValue1Range2 = item.value1[1];
                                    }
                                }
                            }
                            
                            if (conditionWhiteList[condition2Index] !== "inRange") {
                                if (item.type === "number") {
                                    paramValue2 = parseFloat(item.value2);
                                }
                                else {
                                    paramValue2 = item.value2;
                                }
                            }
                            else {
                                if (!validation.isEmptyObject(item.value2[0])) {
                                    if (item.type === "number") {
                                        paramValue2Range1 = parseFloat(item.value2[0]);
                                    }
                                    else {
                                        paramValue2Range1 = item.value2[0];
                                    }
                                }
                                else {
                                    return ``;
                                }
                                if (!validation.isEmptyObject(item.value2[1])) {
                                    if (item.type === "number") {
                                        paramValue2Range2 = parseFloat(item.value2[1]);
                                    }
                                    else {
                                        paramValue2Range2 = item.value2[1];
                                    }
                                }
                            }
                            
                            switch (conditionWhiteList[condition1Index]) {
                                case "equals":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` = @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "notEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` != @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "startsWith":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sql.NVarChar, paramValue1 + `%`);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value1)`;
                                    break;
                                case "endsWith":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sql.NVarChar, `%` + paramValue1);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value1)`;
                                    break;
                                case "contains":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sql.NVarChar, `%` + paramValue1 + `%`);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value1)`;
                                    break;
                                case "notContains":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sql.NVarChar, `%` + paramValue1 + `%`);
                                    sqlStr += ` NOT LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value1)`;
                                    break;
                                case "lessThan":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` < @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "lessThanOrEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` <= @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "greaterThan":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` > @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "greaterThanOrEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` >= @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "inRange":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1Range1", sqlType, paramValue1Range1);
                                    if (!validation.isEmptyObject(item.value1[1])) {
                                        sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1Range2", sqlType, paramValue1Range2);
                                        if (item.type === "date" || item.type === "time") {
                                            sqlStr += `(cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) >= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range1 AND cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) <= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range2)`;
                                        }
                                        else {
                                            sqlStr += `(` + fieldWhiteList[fieldFilterIndex] + ` >= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range1 AND ` + fieldWhiteList[fieldFilterIndex] + ` <= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range2)`;
                                        }
                                    }
                                    else {
                                        if (item.type === "date" || item.type === "time") {
                                            sqlStr += `(cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) >= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range1)`;
                                        }
                                        else {
                                            sqlStr += `(` + fieldWhiteList[fieldFilterIndex] + ` >= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range1)`;
                                        }
                                    }
                                    break;
                            }
        
                            if (conditionWhiteList[condition2Index] !== "inRange") {
                                if (item.type === "date" || item.type === "time" || item.type === "number") {
                                    sqlStr += ` ` + operatorWhiteList[operatorIndex] + ` ` + fieldWhiteList[fieldFilterIndex];
                                }
                                else {
                                    switch (conditionWhiteList[condition2Index]) {
                                        case "startsWith":
                                            sqlStr += ` ` + operatorWhiteList[operatorIndex] + ` UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "endsWith":
                                            sqlStr += ` ` + operatorWhiteList[operatorIndex] + ` UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "contains":
                                            sqlStr += ` ` + operatorWhiteList[operatorIndex] + ` UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "notContains":
                                            sqlStr += ` ` + operatorWhiteList[operatorIndex] + ` UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        default:
                                            sqlStr += ` ` + operatorWhiteList[operatorIndex] + ` ` + fieldWhiteList[fieldFilterIndex];
                                            break;
                                    }
                                }
                            }
                            else {
                                sqlStr += ` ` + operatorWhiteList[operatorIndex] + ` `;
                            }
                            
                            switch (conditionWhiteList[condition2Index]) {
                                case "equals":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sqlType, paramValue2);
                                    sqlStr += ` = @` + fieldWhiteList[fieldFilterIndex] + `Value2`;
                                    break;
                                case "notEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sqlType, paramValue2);
                                    sqlStr += ` != @` + fieldWhiteList[fieldFilterIndex] + `Value2`;
                                    break;
                                case "startsWith":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sql.NVarChar, paramValue2 + `%`);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value2)`;
                                    break;
                                case "endsWith":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sql.NVarChar, `%` + paramValue2);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value2)`;
                                    break;
                                case "contains":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sql.NVarChar, `%` + paramValue2 + `%`);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value2)`;
                                    break;
                                case "notContains":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sql.NVarChar, `%` + paramValue2 + `%`);
                                    sqlStr += ` NOT LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value2)`;
                                    break;
                                case "lessThan":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sqlType, paramValue2);
                                    sqlStr += ` < @` + fieldWhiteList[fieldFilterIndex] + `Value2`;
                                    break;
                                case "lessThanOrEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sqlType, paramValue2);
                                    sqlStr += ` <= @` + fieldWhiteList[fieldFilterIndex] + `Value2`;
                                    break;
                                case "greaterThan":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sqlType, paramValue2);
                                    sqlStr += ` > @` + fieldWhiteList[fieldFilterIndex] + `Value2`;
                                    break;
                                case "greaterThanOrEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2", sqlType, paramValue2);
                                    sqlStr += ` >= @` + fieldWhiteList[fieldFilterIndex] + `Value2`;
                                    break;
                                case "inRange":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2Range1", sqlType, paramValue2Range1);
                                    if (!validation.isEmptyObject(item.value2[1])) {
                                        sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value2Range2", sqlType, paramValue2Range2);
                                        if (item.type === "date" || item.type === "time") {
                                            sqlStr += `(cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) >= @` + fieldWhiteList[fieldFilterIndex] + "Value2Range1" + ` AND cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) <= @` + fieldWhiteList[fieldFilterIndex] + `Value2Range2)`;
                                        }
                                        else {
                                            sqlStr += `(` + fieldWhiteList[fieldFilterIndex] + ` >= @` + fieldWhiteList[fieldFilterIndex] + "Value2Range1" + ` AND ` + fieldWhiteList[fieldFilterIndex] + ` <= @` + fieldWhiteList[fieldFilterIndex] + `Value2Range2)`;
                                        }
                                    }
                                    else {
                                        if (item.type === "date" || item.type === "time") {
                                            sqlStr += `(cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) >= @` + fieldWhiteList[fieldFilterIndex] + `Value2Range1)`;
                                        }
                                        else {
                                            sqlStr += `(` + fieldWhiteList[fieldFilterIndex] + ` >= @` + fieldWhiteList[fieldFilterIndex] + `Value2Range1)`;
                                        }
                                    }
                                    break;
                            }
        
                            sqlStr += `)`;
                        }
                    }
                    else {
                        if (condition1Index >= 0) {
                            let sqlType = sql.NVarChar;
                            let paramValue1 = item.value1;
                            let paramValue1Range1;
                            let paramValue1Range2;

                            if (conditionWhiteList[condition1Index] !== "inRange") {
                                if (item.type === "date" || item.type === "time") {
                                    sqlStr += ` AND cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime)`;
                                }
                                else if (item.type === "number") {
                                    sqlStr += ` AND ` + fieldWhiteList[fieldFilterIndex];
                                }
                                else {
                                    switch (conditionWhiteList[condition1Index]) {
                                        case "startsWith":
                                            sqlStr += ` AND UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "endsWith":
                                            sqlStr += ` AND UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "contains":
                                            sqlStr += ` AND UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        case "notContains":
                                            sqlStr += ` AND UPPER(` + fieldWhiteList[fieldFilterIndex] + `)`;
                                            break;
                                        default:
                                            sqlStr += ` AND ` + fieldWhiteList[fieldFilterIndex];
                                            break;
                                    }
                                }
                                
                                if (item.type === "number") {
                                    sqlType = sql.Float;
                                    paramValue1 = parseFloat(item.value1);
                                }
                                else {
                                    paramValue1 = item.value1;
                                }
                            }
                            else {
                                sqlStr += ` AND `;
                                if (item.type === "number") {
                                    sqlType = sql.Float;
                                    if (!validation.isEmptyObject(item.value1[0])) {
                                        paramValue1Range1 = parseFloat(item.value1[0]);
                                    }
                                    else {
                                        return ``;
                                    }
                                    if (!validation.isEmptyObject(item.value1[1])) {
                                        paramValue1Range2 = parseFloat(item.value1[1]);
                                    }
                                }
                                else {
                                    if (!validation.isEmptyObject(item.value1[0])) {
                                        paramValue1Range1 = item.value1[0];
                                    }
                                    else {
                                        return ``;
                                    }
                                    if (!validation.isEmptyObject(item.value1[1])) {
                                        paramValue1Range2 = item.value1[1];
                                    }
                                }
                            }
                            
                            switch (conditionWhiteList[condition1Index]) {
                                case "equals":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` = @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "notEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` != @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "startsWith":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sql.NVarChar, paramValue1 + `%`);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value1)`;
                                    break;
                                case "endsWith":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sql.NVarChar, `%` + paramValue1);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value1)`;
                                    break;
                                case "contains":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sql.NVarChar, `%` + paramValue1 + `%`);
                                    sqlStr += ` LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value1)`;
                                    break;
                                case "notContains":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sql.NVarChar, `%` + paramValue1 + `%`);
                                    sqlStr += ` NOT LIKE UPPER(@` + fieldWhiteList[fieldFilterIndex] + `Value1)`;
                                    break;
                                case "lessThan":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` < @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "lessThanOrEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` <= @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "greaterThan":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` > @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "greaterThanOrEqual":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1", sqlType, paramValue1);
                                    sqlStr += ` >= @` + fieldWhiteList[fieldFilterIndex] + `Value1`;
                                    break;
                                case "inRange":
                                    sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1Range1", sqlType, paramValue1Range1);
                                    if (!validation.isEmptyObject(item.value1[1])) {
                                        sqlRequest.input(fieldWhiteList[fieldFilterIndex] + "Value1Range2", sqlType, paramValue1Range2);
                                        sqlStr += `(cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) >= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range1 AND cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) <= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range2)`;
                                    }
                                    else {
                                        if (item.type === "date") {
                                            sqlStr += `(cast(convert(char(11), ` + fieldWhiteList[fieldFilterIndex] + `, 113) as datetime) >= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range1)`;
                                        }
                                        else {
                                            sqlStr += `(` + fieldWhiteList[fieldFilterIndex] + ` >= @` + fieldWhiteList[fieldFilterIndex] + `Value1Range1)`;
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    return sqlStr;
}

// Build order by sql
async function buildOrder(objSearch, fieldWhiteList, defaultOrder) {
    let orderStr = "ORDER BY ";
    if (objSearch.Sort.length === 0) {
        orderStr += defaultOrder;
    }
    else {
        for (let i = 0; i < objSearch.Sort.length; i++) {
            let item = objSearch.Sort[i];

            let fieldIndex = fieldWhiteList.indexOf(item.field);
            if (fieldIndex < 0) {
                continue;
            }
            let orderIndex = orderWhiteList.indexOf(item.type);
            if (orderIndex < 0 || orderWhiteList[orderIndex] === null) {
                continue;
            }

            if (i !== 0) {
                orderStr += `,`;
            }
            orderStr += fieldWhiteList[fieldIndex] + ` ` + (orderWhiteList[orderIndex] !== null ? orderWhiteList[orderIndex] : `asc`);
        }
    }
    if (orderStr === "ORDER BY ") {
        orderStr += defaultOrder;
    }

    return orderStr;
}

// Write log
async function writeLog(logContent) {
    let logInfo = {
        UserNo: logContent.UserNo,
        ActionContent: logContent.ActionContent,
        ActionCode: logContent.ActionCode
    }
    let sqlRequest = this.fillData(T_Riyo, logInfo);

    let strField = "";
    let strParam = "";
    for (var i = 0; i < T_Riyo.columns.length; i++) { 
        var item = T_Riyo.columns[i];
        if (typeof logInfo[item.key] !== "undefined" && !item.isPk) {
            strField += item.key + ","
            strParam += "@" + item.key + ","
        }
        else {
            if (item.defaultValue !== null && !item.isPk) {
                strField += item.key + ","
                strParam += item.defaultValue + ","
            }
        }
    }
    if (strField.length > 0) {
        strField = strField.substr(0, strField.length - 1);
        strParam = strParam.substr(0, strParam.length - 1);
    }

    let result;
    try {
        let sqlStr = `INSERT INTO ${T_Riyo.tableName} (${strField}) VALUES (${strParam})`;
        let query = new Promise(function(resolve, reject) {
            sqlRequest.query(sqlStr, function(err, res) {
                if(res) {
                    resolve(res);
                }else {
                    reject(err);
                }
            });
        });
        await query.then(res => {
            result = true;
        }).catch(err => {
            console.log(err);
            result = false;
        });
        return result;
    } catch(err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    logContent,
    DB,
    sql,
    fillData,
    createNew,
    createNewGetId,
    updateById,
    updateByCondition,
    getDetailByID,
    searchData,
    deleteData,
    buildFilter,
    buildOrder,
    writeLog
};