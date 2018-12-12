'use strict';
const baseModel = require('../base/BaseModel');

const sql = baseModel.sql;
const T_Table = {
    tableName: "V_LoginInfo",
    columns: [
        { key: "BRANCHCD", type: sql.Char(7), isPk: false, defaultValue: null },
        { key: "CLERKCD", type: sql.Char(6), isPk: false, defaultValue: null },
        { key: "CLERKNAME", type: sql.NVarChar(20), isPk: false, defaultValue: null },
        { key: "CLERKKANA", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "USERID", type: sql.VarChar(20), isPk: false, defaultValue: null },
        { key: "PASSWORD", type: sql.VarChar(256), isPk: false, defaultValue: null },
        { key: "MAILADDRESS", type: sql.VarChar(50), isPk: false, defaultValue: null },
        { key: "MANAGERF", type: sql.Char(1), isPk: false, defaultValue: null },
        { key: "adjustNo", type: sql.Int, isPk: false, defaultValue: null },
        { key: "Option1", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "Option2", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "Option3", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "Option4", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "Option5", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "LoginDate", type: sql.DateTime, isPk: false, defaultValue: null },
        { key: "LoginIp", type: sql.VarChar(20), isPk: false, defaultValue: null },
        { key: "PasswordDate", type: sql.DateTime, isPk: false, defaultValue: null },
        { key: "oldPassword", type: sql.DateTime, isPk: false, defaultValue: null },
        { key: "LastActionDate", type: sql.DateTime, isPk: false, defaultValue: null },
        { key: "LoginSessionID", type: sql.VarChar(100), isPk: false, defaultValue: null },
        { key: "ApplicationPrintF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "PdfHistoryF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "RegistrationIpAddress", type: sql.VarChar(500), isPk: false, defaultValue: null },
        { key: "BikouF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "FirstAcoPolicyNoF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "MailToken", type: sql.VarChar(100), isPk: false, defaultValue: null },
        { key: "StartDate", type: sql.DateTime, isPk: false, defaultValue: null },
        { key: "EndDate", type: sql.DateTime, isPk: false, defaultValue: null },
        { key: "SoudanAuthF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "InquiryAuthF", type: sql.TinyInt, isPk: false, defaultValue: null },
        { key: "BRANCHNAME", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "SHOPNAME", type: sql.NVarChar(40), isPk: false, defaultValue: null },
        { key: "SHOPNAMES", type: sql.NVarChar(20), isPk: false, defaultValue: null },
        { key: "BRANCHF", type: sql.Char(2), isPk: false, defaultValue: null },
        { key: "CORPINFONO", type: sql.Int, isPk: false, defaultValue: null },
        { key: "AgentCd1", type: sql.Char(5), isPk: false, defaultValue: null },
        { key: "SystemNo", type: sql.Int, isPk: false, defaultValue: null }
    ]
};

//#region only kanri -------------------------------------------------------------------------------------
async function getListLoginInfo(objSearch) {
    return baseModel.searchData(T_Table, objSearch, []);
}
//#endregion

module.exports = {
    getListLoginInfo
}