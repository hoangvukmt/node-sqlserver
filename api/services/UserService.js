'use strict';

var jwt = require('jsonwebtoken');
const systemConfig = require('config');

const UserModel = require('../models/T_User');
const ResCode = require('../util/validation').RESPONSE_CODE;

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
        
        return {
            code: ResCode.SUCCESS,
            message: 'Login success',
            data: { 
                token: token, 
                user_no: user.UserNo
            }
        }
    } else {
        return {
            code: ResCode.AUTH_FAIL,
            message:'Password incorrect!'
        }
    }
}

async function create(createUser) {
    let login_id = createUser.LoginId;
    let password = createUser.Password;

    let data = await UserModel.asyncCreateUser(createUser); 

    if (!data) {
        return {
            code: ResCode.AUTH_FAIL,
            message:'No data'
        }
    }

    if (data){
        // create a token
        const token = jwt.sign(
            {
                login_id: login_id,
                user_no: data.UserNo
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
            message: 'Create success',
            data: { 
                token: token, 
                user_no: data.UserNo
            }
        }
    } 
}

async function updateById(updateUser) {
    let login_id = updateUser.LoginId;
    let password = updateUser.Password;
    let user_no = updateUser.UserNo;

    let data = await UserModel.updateUser(updateUser); 

    if (!data) {
        return {
            code: ResCode.AUTH_FAIL,
            message:'No data'
        }
    }

    if (data){
        return {
            code: ResCode.SUCCESS,
            message: 'Update success',
            data: { 
                user_no: data.UserNo
            }
        }
    } 
}

async function exportData(startTime) {
    /* Xem lại đoạn này
        - Nên gọi vào getAllData() trong model để lấy dữ liệu
        - Sau khi đã có dữ liệu thì gọi excelHelper.exportData để xuất ra excel
        - Bởi vì:
            + Việc xuất dữ liệu ra thành file excel là một nghiệp vụ rõ ràng
            + Việc xử lý nghiệp vụ do lớp service đảm nhiệm model chỉ truy vấn BD thôi
            => vi phạm coding convention về quy ước nhiệm vụ giữa các tầng
        - Xem tiếp comment trong hàm excelHelper.exportData
    */
    let data = await UserModel.exportData(startTime); 
    if (!data) {
        return {
            code: ResCode.AUTH_FAIL,
            message:'Export fail'
        }
    }

    if (data){
        return {
            code: ResCode.SUCCESS,
            message: 'Export success',
        }
    } 
}

module.exports = {
    login,
    create,
    updateById,
    exportData
}