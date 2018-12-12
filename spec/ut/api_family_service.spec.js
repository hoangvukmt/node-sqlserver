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

describe('POST /api/getfamily - TEST GET FAMILY',  function(){
    let api_url = '/api/getfamily';
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
                login_id: "hida@infordio.co.jp"
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/createfamily - TEST CREATE FAMILY',  function(){
    let api_url = '/api/createfamily';
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
                relation: 0,
                sex: 0,
                last_name: 'lastNametest',
                first_name: 'firtsNametest',
                seq_no: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/updatefamily - TEST UPDATE FAMILY',  function(){
    let api_url = '/api/updatefamily';
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
                family_no: 1,
                user_no: '1',
                relation: '0',
                sex: '0',
                last_name: 'lastNameupdate',
                first_name: 'firtsNameupdate',
                birthday: '1990/10/20',
                seq_no: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/getListFamily - TEST GET LIST FAMILY',  function(){
    let api_url = '/api/getListFamily';
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

describe('POST /api/getInfoFamily - TEST GET INFO FAMILY',  function(){
    let api_url = '/api/getInfoFamily';
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
                family_no: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/deleteFamily - TEST DELETE FAMILY',  function(){
    let api_url = '/api/deleteFamily';
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
                family_no: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});