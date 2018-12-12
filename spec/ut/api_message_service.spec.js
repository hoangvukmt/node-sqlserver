'use strict';

var expect = require('chai').expect;
var app = require('../../app');
const request = require('supertest');
const resCode = require('../../api/util/validation').RESPONSE_CODE;
const systemConfig = require('config');

describe('POST /api/uploadFile: LOGIN FIRST - This is required', function(){
    it('Response for login with validate account: ' + systemConfig.get('TestENV.utTestAcc.login_id') + ',password=' + systemConfig.get('TestENV.utTestAcc.password') + '', async function(){
        let test = request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({login_id: systemConfig.get('TestENV.utTestAcc.login_id'), password: systemConfig.get('TestENV.utTestAcc.password')});
        await test.then(res => {
            expect(res.body.code).to.be.equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/getListMessage - TEST GET LIST MESSAGE',  function(){
    let api_url = '/api/getListMessage';
    it('Response for request without token supply', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('No token provided.');
        })
    });

    it('Response for request with supply invalid token ', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token','notvalidtoken')
        await test.then(res => {
            expect(res.body.code).equal('401');
            expect(res.body.message).equal('Failed to authenticate token.');
        })
    });
    
    it('Response for request with supply invalid token ', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token','notvalidtoken')
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('Failed to authenticate token.');
        })
    });

    it('Response for request with valid token but without required parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
        })
    });

    it('Response for request with valid token but invalid required parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                invalid: 0
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
        })
    });

    it('Response for request with valid token && valid parameter', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                user_no: 1
            })
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/getDetailMessage - TEST GET CONTENT OF ONE MESSAGE',  function(){
    let api_url = '/api/getDetailMessage';
    it('Response for request without token supply', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('No token provided.');
        })
    });

    it('Response for request with supply invalid token ', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token','notvalidtoken')
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('Failed to authenticate token.');
        })
    });
    
    it('Response for request with valid token but without required parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
        })
    });

    it('Response for request with valid token but invalid required parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                invalid: 0
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
        })
    });

    it('Response for request with valid token && valid parameter', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                message_no: 1
            })
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/createMessage - TEST CREATE NEW MESSAGE',  function(){
    let api_url = '/api/createMessage';
    it('Response for request without token supply', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('No token provided.');
        })
    });

    it('Response for request with supply invalid token ', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token','notvalidtoken')
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('Failed to authenticate token.');
        })
    });
    
    it('Response for request with valid token but without required parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
        })
    });

    it('Response for request with valid token but invalid required parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                invalid: 0
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
        })
    });

    it('Response for request with valid token && valid parameter type = 1', async function(){
        let createMessage = {
            user_no: 1,
            message_title: 'Test create message title',
            message:'test message content',
            message_type: 1
        }
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send(createMessage);
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });

    it('Response for request with valid token && valid parameter type = 2', async function(){
        let createMessage = {
            user_no: 1,
            message_title: 'Test create message title',
            message:'test message content',
            message_type: 2
        }
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send(createMessage);
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });

    it('Response for request with valid token && valid parameter type = 3', async function(){
        let createMessage = {
            user_no: 1,
            message_title: 'Test create message title',
            message:'test message content',
            message_type: 3
        }
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send(createMessage);
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});