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

describe('POST /api/getListAgent - TEST GET LIST AGENT',  function(){
    let api_url = '/api/getListAgent';
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

    it('Response for request with valid token && valid parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                user_no: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/createAgent - TEST CREATE AGENT',  function(){
    let api_url = '/api/createAgent';
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

    it('Response for request with valid token && valid parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                user_no: 1,
                agent_name: 'TestCreateAgent'
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/getInfoAgent - TEST GET INFO AGENT',  function(){
    let api_url = '/api/getInfoAgent';
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

    it('Response for request with valid token && valid parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                agent_no: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/deleteAgent - TEST DELETE AGENT',  function(){
    let api_url = '/api/deleteAgent';
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

    it('Response for request with valid token && valid parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                agent_no: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/updateAgent - TEST UPDATE AGENT',  function(){
    let api_url = '/api/updateAgent';
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

    it('Response for request with valid token && valid parameters', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                agent_no: 1,
                agent_name: 'TestUpdateAgent'
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});