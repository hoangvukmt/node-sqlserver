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

describe('POST /api/getListKeiyaku',  function(){
    let api_url = '/api/getListKeiyaku';
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

describe('POST /api/getDetailKeiyaku',  function(){
    let api_url = '/api/getDetailKeiyaku';
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
                keiyaku_no: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/createKeiyaku',  function(){
    let api_url = '/api/createKeiyaku';
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
        let newKeiYaku = {
            group_id: 1,
            family_no: 1,
            hiho_family_no: 1,
            agent_no: 1,
            hosho_category_f: 2,
            status: 2,
            kani_shindan_f: 1,
            shoken_bunseki_f: 1
        }
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send(newKeiYaku);
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });

});

describe('POST /api/updateKeiyaku',  function(){
    let api_url = '/api/updateKeiyaku';
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

    it('Response for request with valid token && valid parameters, but not exist keiyaku', async function(){
        let updateKeiYaku = {
            keiyaku_no: 0,
            group_id:0,
            family_no: 1,
            hiho_family_no: 1,
            agent_no: 1,
            hosho_category_f: 2,
            status: 2
        }
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send(updateKeiYaku);
        await test.then(res => {
            expect(res.body.code).equal(resCode.SERVER_ERROR);
        })
    });

    it('Response for request with valid token && valid parameters', async function(){
        let updateKeiYaku = {
            keiyaku_no: 1,
            group_id:0,
            family_no: 1,
            hiho_family_no: 1,
            agent_no: 1,
            hosho_category_f: 2,
            status: 2
        }
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send(updateKeiYaku);
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });

});

describe('POST /api/deleteKeiyaku',  function(){
    let api_url = '/api/deleteKeiyaku';
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

    it('Response for request with valid token && valid parameters, but not exist keiyaku', async function(){
        let updateKeiYaku = {
            keiyaku_no: 0
        }
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send(updateKeiYaku);
        await test.then(res => {
            expect(res.body.code).equal(resCode.SERVER_ERROR);
        })
    });

    it('Response for request with valid token && valid parameters', async function(){
        let updateKeiYaku = {
            keiyaku_no: 1
        }
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send(updateKeiYaku);
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});