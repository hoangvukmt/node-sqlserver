//check logic in services before call to model
'use strict';
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var uuidv1 = require('uuid/v1');
const systemConfig = require('config');
var nodemailer = require('nodemailer');

const UserModel = require('../models/T_User');
const VLoginInfoModel = require('../models/V_LoginInfo');
const VAgentModel = require('../models/V_Agent');
const AgentModel = require('../models/T_Agent');
const baseModel = require('../base/BaseModel');
const Mail = require('../models/M_Mail');

const ResCode = require('../util/validation').RESPONSE_CODE;
const validation = require('../util/validation');

const logService = require('./LogService');

async function login(loginUser) {
    let login_id = loginUser.LoginId;
    let password = loginUser.Password;

    if(typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV.trim() === 'test') {
        if (login_id === systemConfig.get('TestENV.utTestAcc.login_id') && password === systemConfig.get('TestENV.utTestAcc.password')) {
            const token = jwt.sign(
                {
                    login_id: login_id,
                    user_no: 1
                },
                systemConfig.get('TestENV.token.seed'),
                {
                    expiresIn: systemConfig.get('TestENV.token.expire')
                }
            );
            process.env.token = token;
            return {
                code: ResCode.SUCCESS,
                message:''
            }
        }
        else {
            return {
                code: ResCode.AUTH_FAIL,
                message:'LoginId/Password incorrect!'
            }
        }
    }
    
    let user = await UserModel.asyncGetUserbyLoginId(login_id);
    
    if (!user) {
        return {
            code: ResCode.AUTH_FAIL,
            message:'LoginId/Password incorrect!'
        }
    }

    if (user.Password === password){
        // create a token
        const token = jwt.sign(
            {
                login_id: login_id,
                user_no: user.UserNo
            },
            systemConfig.get('TestENV.token.seed'),
            {
                expiresIn: systemConfig.get('TestENV.token.expire')
            }
        );

        if (typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV.trim() === 'test') {
            process.env.token = token;
        }
        //add to history in T_Riyo
        let logContent = {
            UserNo: user.UserNo,
            ActionContent: baseModel.logContent.Login,
            ActionCode: 2
        }
        await baseModel.writeLog(logContent);
        
        return {
            code: ResCode.SUCCESS,
            message: 'Login success',
            data: { 
                token: token, 
                user_no: user.UserNo, 
                family_no: user.FamilyNo, 
                agent_cd: user.AgentCd, 
                hoken_shoken_f: user.HokenShokenF
            }
        }
    } else {
        return {
            code: ResCode.AUTH_FAIL,
            message:'LoginId/Password incorrect!'
        }
    }
}

async function registerNewUser(userinfo) {
    if(validation.validateEmail(userinfo.email)) {
        let createdUser = await asyncCreateUser(userinfo);
        if (createdUser !== ResCode.DUPLICATE && createdUser !== ResCode.NOT_EXIST) {
            let logContent = {
                UserNo: createdUser.UserNo,
                ActionContent: baseModel.logContent.HokenBunseki_Kaishi,
                ActionCode: 1
            }
            await baseModel.writeLog(logContent);

            let sendUserinfo = {
                LoginId: createdUser.LoginId,
                Password: createdUser.Password
            }
            asyncSendEmail(sendUserinfo);

            return {
                code: ResCode.SUCCESS,
                message: 'Sent register mail to user!'
            };
        } else {
            if (createdUser === ResCode.DUPLICATE){
                return {
                    code: ResCode.DUPLICATE,
                    message: 'This email is existed!'
                }
            }
            else {
                return {
                    code: ResCode.NOT_EXIST,
                    message: 'Angent is not exist!'
                }
            }
        }
    }else {
        return {
            code: ResCode.REQUIRED,
            message: 'Email is invalid!'
        };
    }
}

async function asyncResetPassword(email) {
    if(validation.validateEmail(email)) {
        //check user existed?
        let existed = await UserModel.asyncGetUserbyLoginId(email);
        if (!existed) {
            return {
                code: ResCode.NOT_EXIST,
                message: 'Reset password fail!'
            }
        }

        //gen new password - unique
        let newPass = crypto.randomBytes(5).toString('hex');
        let user = {
            LoginId: email,
            Password: newPass
        }
        console.log(newPass);
        let resetResult = await UserModel.asyncResetPassword(user);
        if (resetResult) {
            let logContent = {
                UserNo: existed.UserNo,
                ActionContent: baseModel.logContent.ReSendPass,
                ActionCode: 4
            }
            await baseModel.writeLog(logContent);

            //send new password to user's email
            asyncSendEmail(user);

            return {
                code: ResCode.SUCCESS,
                message: 'Sent new password to email of user'
            }
        } else {
            return {
                code: ResCode.NOT_EXIST,
                message: 'Reset password fail!'
            }
        }
    } else {
        return {
            code: ResCode.NOT_EXIST,
            message: 'Reset password fail!'
        }
    }
}

async function changePassword(objSearch) {
    let requiredFields = [
        'oldPass',
        'newPass'
    ]
    let checkRequired = validation.checkRequiredFields(objSearch, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let loginId = objSearch.tokenData.login_id;

    if (typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV.trim() === 'test') {
        loginId = systemConfig.get('TestENV.utTestAcc.login_id');
    }
    
    let user = await UserModel.asyncGetUserbyLoginId(loginId);

    if (!user) {
        return {
            code: ResCode.NOT_EXIST,
            message: 'Change password fail!'
        }
    }
    if (user.Password === objSearch.oldPass || (typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV.trim() === 'test')){
        let user = {
            LoginId: loginId,
            Password: objSearch.newPass
        }
        let result = await UserModel.asyncResetPassword(user);
        if (result) {
            // add history to T_Riyo
            let logContent = {
                UserNo: objSearch.tokenData.user_no,
                ActionContent: baseModel.logContent.ChangePass,
                ActionCode: 3
            }
            await baseModel.writeLog(logContent);

            return {
                code: ResCode.SUCCESS,
                message: 'Change password success!'
            }
        } else {
            return {
                code: ResCode.NOT_EXIST,
                message: 'Change password fail!'
            }
        }
    }
    else {
        return {
            code: ResCode.AUTH_FAIL,
            message:'Old password incorrect!'
        }
    }
}

async function asyncHideDialog(data) {
    let requiredFields = [
        'HokenShokenF'
    ]
    let checkRequired = validation.checkRequiredFields(data, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }
    
    let result = await UserModel.updateUser(data);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message: 'Update successed!'
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot update information!'
        }
    }
}

async function asyncCreateUser(userinfo) {
    let user = {
        LoginId: userinfo.email,
        UserNo: 0,
        AgentCd: userinfo.agentCd,
        Password: '',
        CustomerNumber: ''
    }

    // Check user existed?
    let existedUser = await UserModel.asyncGetUserbyLoginId(user.LoginId);
    if (existedUser) {
        return ResCode.DUPLICATE;
    }

    // Check agent cd valid
    let agentInfo = await VAgentModel.getDetailAgent({AgentCd: user.AgentCd});
    if (!agentInfo) {
        return ResCode.NOT_EXIST
    }

    // Gen new password - unique
    user.Password = crypto.randomBytes(5).toString('hex');

    // In test env, fix password is 3b8c8f06d3
    if(typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV.trim() === 'test') {
        user.Password = '3b8c8f06d3';
    }

    // Gen new CustomerNumber - unique
    user.CustomerNumber = uuidv1().substr(0,10);
    let createUser = await UserModel.asyncCreateUser(user);

    if (createUser) {
        user.UserNo = createUser.id;
        // Create Agent info
        let AgentInsert = {
            UserNo: createUser.id,
            AgentName: agentInfo.AgentName,
            TantoName: agentInfo.TantoName,
            Phone: agentInfo.Phone,
            KeiyakuPage: agentInfo.KeiyakuPage
        };
        AgentModel.createAgent(AgentInsert);
    }
    return user;
}

async function asyncSendEmail(userInfo) {
    let mailInfo =  await Mail.asyncGetMail(1);
    if (!mailInfo) {
        return {
            code: ResCode.SERVER_ERROR,
            message: 'Cannot get mailer information!'
        }
    }

    let mailBody = makeMailBody(userInfo, mailInfo);
    let mailTransport = {};
    let sendOption = {
        from: null,//from: Address to send mail, config after below
        subject: mailInfo.Subject,
        to: userInfo.LoginId,
        text: mailBody
    }    
    if(typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV.trim() === 'test'){
        let mailConfig = systemConfig.get("TestENV.emailConfig");
        mailTransport = {
            service: mailConfig.service,
            host: mailConfig.host,
            auth: mailConfig.auth
        }
        sendOption.from = mailConfig.from;
    } else {
        mailTransport = {
            host: mailInfo.Host,
            port: mailInfo.Port,
        };
        sendOption.from =  mailInfo.FromAddress
    }
    var transporter = nodemailer.createTransport(mailTransport);
    transporter.sendMail(sendOption, async function (error, info){
        if (error) {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "UserService.js" },
                { key: "Function", content: "asyncSendEmail" },
                { key: "Line", content: 320 },
                { key: "Err", content: error }
            ]
            await logService.errorLog(logData);
        } else {
            let logData = [
                { key: "Time", content: new Date() },
                { key: "File", content: "UserService.js" },
                { key: "Function", content: "asyncSendEmail" },
                { key: "Info", content: info.response }
            ]
            await logService.accessLog(logData);
        }
    });
}

function makeMailBody(user, mailConfig) {
    let mailBody = mailConfig.TextTemplate;
    mailBody = mailBody.replace(`{=LoginId}`, `${user.LoginId}`);
    mailBody = mailBody.replace(`{=Password}`, `${user.Password}`);
    return mailBody;
}

//#region only kanri -------------------------------------------------------------------------------------
async function kanriLogin(objData) {
    let requiredFields = [
        'LoginId',
        'Password'
    ]
    let checkRequired = validation.checkRequiredFields(objData, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let login_id = objData.LoginId;
    let password = objData.Password;

    if(typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV.trim() === 'test') {
        if (login_id === systemConfig.get('TestENV.utTestAcc.login_id') && password === systemConfig.get('TestENV.utTestAcc.password')) {
            const token = jwt.sign(
                {
                    login_id: login_id,
                    user_no: 1
                },
                systemConfig.get('TestENV.token.seed'),
                {
                    expiresIn: systemConfig.get('TestENV.token.expire')
                }
            );
            process.env.token = token;
            return {
                code: ResCode.SUCCESS,
                message:''
            }
        }
        else {
            return {
                code: ResCode.AUTH_FAIL,
                message:'LoginId/Password incorrect!'
            }
        }
    }
    
    let objSearch = {
        USERID: login_id
    }
    let result = await VLoginInfoModel.getListLoginInfo(objSearch);
    
    if (!result || result.length === 0) {
        return {
            code: ResCode.AUTH_FAIL,
            message:'LoginId/Password incorrect!'
        }
    }

    let user = result[0];
    if (user.PASSWORD === password){
        if (!validation.isEmptyObject(user.EndDate)) {
            if (new Date() > new Date(user.EndDate)) {
                return {
                    code: ResCode.AUTH_FAIL,
                    message: 'OutOfDate'
                }
            }
        }

        // create a token
        const token = jwt.sign(
            {
                login_id: login_id,
                BranchCd: user.BRANCHCD,
                ClerkCd: user.CLERKCD,
                ClerkName: user.CLERKNAME,
                UserId: user.USERID
            },
            systemConfig.get('TestENV.token.seed'),
            {
                expiresIn: systemConfig.get('TestENV.token.expire')
            }
        );

        if (typeof process.env.NODE_ENV !== "undefined" && process.env.NODE_ENV.trim() === 'test') {
            process.env.token = token;
        }
        
        return {
            code: ResCode.SUCCESS,
            message: 'Login success',
            data: {
                token: token,
                AgentCd1: user.AgentCd1,
                ApplicationPrintF: user.ApplicationPrintF,
                BRANCHCD:  user.BRANCHCD,
                BRANCHF: user.BRANCHF,
                BRANCHNAME:  user.BRANCHNAME,
                BikouF: user.BikouF,
                CLERKCD: user.CLERKCD,
                CLERKKANA: user.CLERKKANA,
                CLERKNAME: user.CLERKNAME,
                CORPINFONO: user.CORPINFONO,
                EndDate: user.EndDate,
                FirstAcoPolicyNoF: user.FirstAcoPolicyNoF,
                InquiryAuthF: user.InquiryAuthF,
                MAILADDRESS: user.MAILADDRESS,
                MANAGERF: user.MANAGERF,
                Option1: user.Option1,
                Option2: user.Option2,
                Option3: user.Option3,
                Option4: user.Option4,
                Option5: user.Option5,
                PdfHistoryF: user.PdfHistoryF,
                SHOPNAME: user.SHOPNAME,
                SHOPNAMES: user.SHOPNAMES,
                SoudanAuthF: user.SoudanAuthF,
                SystemNo: user.SystemNo,
                adjustNo: user.adjustNo
            }
        }
    } else {
        return {
            code: ResCode.AUTH_FAIL,
            message:'LoginId/Password incorrect!'
        }
    }
}

async function searchCustomer(objSearch) {
    let result = await UserModel.searchCustomer(objSearch);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: result.data,
            totalRecord: result.totalRecord
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}

async function getUserInfo(objData) {
    let requiredFields = [
        'LoginId'
    ]
    let checkRequired = validation.checkRequiredFields(objData, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let objSearch = {
        USERID: objData.LoginId
    }
    let result = await VLoginInfoModel.getListLoginInfo(objSearch);
    if (!result || result.length === 0) {
        return {
            code: ResCode.NOT_EXIST,
            message:'User do not exist!'
        }
    }

    let user = result[0];
    if (!validation.isEmptyObject(user.EndDate)) {
        if (new Date() > new Date(user.EndDate)) {
            return {
                code: ResCode.AUTH_FAIL,
                message: 'OutOfDate'
            }
        }
    }
    
    return {
        code: ResCode.SUCCESS
    }
}

async function updateCustomer(objData) {
    let requiredFields = [
        'UserNo'
    ]
    let checkRequired = validation.checkRequiredFields(objData, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    // Update data
    let objUpdate = {
        UserNo: objData.UserNo,
        Memo: objData.Memo
    }
    let result = await UserModel.updateUser(objUpdate);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message: 'Update successed!',
            data: result.id
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot update information!'
        }
    }
}

async function deleteCustomer(objData) {
    let requiredFields = [
        'UserNo'
    ]
    let checkRequired = validation.checkRequiredFields(objData, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    // Update data
    let objUpdate = {
        UserNo: objData.UserNo,
        DelF: 1
    }
    let result = await UserModel.updateUser(objUpdate);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message: 'Delete successed!',
            data: result.id
        };
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error! Cannot delete information!'
        }
    }
}

async function searchTargetCustomer(objSearch) {
    let result = await UserModel.searchTargetCustomer(objSearch);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: result
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}

async function getCustomerInfo(objData) {
    let requiredFields = [
        'UserNo'
    ]
    let checkRequired = validation.checkRequiredFields(objData, requiredFields);
    if (checkRequired.required) {
        let result = {
            code: ResCode.REQUIRED,
            message: 'Parameter(s) is required!',
            data: checkRequired
        };
        return result;
    }

    let result = await UserModel.getCustomerInfo(objData);
    if (result) {
        return {
            code: ResCode.SUCCESS,
            message:'Get successed!',
            data: result
        }
    } else {
        return {
            code: ResCode.SERVER_ERROR,
            message:'Server error!'
        }
    }
}
//#endregion

module.exports = {
    login,
    registerNewUser,
    asyncResetPassword,
    asyncHideDialog,
    changePassword,
    kanriLogin,
    searchCustomer,
    getUserInfo,
    updateCustomer,
    deleteCustomer,
    searchTargetCustomer,
    getCustomerInfo
}