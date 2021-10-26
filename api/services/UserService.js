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
            message:'LoginId/Password incorrect!'
        }
    }
}

module.exports = {
    login
}