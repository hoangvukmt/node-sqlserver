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

describe('POST /api/uploadFile - TEST UPLOAD FILE',  function(){
    let api_url = '/api/uploadFile';
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

    /*
    it('Response for request with valid token && valid parameters', async function(){
        let base64Image = common_util.encodeBase64Image('./upload/img/test-base64.png');
        // console.log(base64Image);
        expect(base64Image).has.property('data');
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token',process.env.token)
            .send({
                group_id: null,
                family_no: 1,
                hiho_family_no: 1,
                file_id: 1,
                file_base_64: base64Image.data
            });
        await test.then(res => {
            console.log(res.body);
            expect(res.body.code).equal('001');
        })
    });
    */
});

describe('POST /api/getListFileUpload - TEST GET LIST FILE UPLOAD',  function(){
    let api_url = '/api/getListFileUpload';
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
                group_id: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/getFileUpload - TEST GET FILE UPLOAD',  function(){
    let api_url = '/api/getFileUpload';
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
                group_id: 1,
                file_id: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/deleteFileUpload - TEST DELETE FILE UPLOAD',  function(){
    let api_url = '/api/deleteFileUpload';
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
                group_id: 1,
                file_id: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/updateGroup - TEST UPDATE GROUP',  function(){
    let api_url = '/api/updateGroup';
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
                group_id: 1,
                auto_f: 1,
                status: 1
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /api/getFileImg - TEST GET FILE IMG',  function(){
    let api_url = '/api/getFileImg';
    it('Response for request without token supply', async function(){
        let test = request(app)
            .get(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('No token provided.');
        })
    });

    it('Response for request with supply invalid token ', async function(){
        let test = request(app)
            .get(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token','notvalidtoken')
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('Failed to authenticate token.');
        })
    });
    
    it('Response for request with valid token && without required parameters', async function(){
        let test = request(app)
            .get(api_url)
            .set('Accept', 'application/json')
            .set('x-access-token', process.env.token);
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
        })
    });
    
    it('Response for request with valid token && valid required parameters', async function(){
        let test = request(app)
            .get(api_url + "?group_id=42&file_id=2&token=" + process.env.token)
            .set('Accept', 'application/json')
            .set('x-access-token', process.env.token)
            .send({})
        await test.then(res => {
            expect(Object.keys(res.body).length).equal(0);
        })
    });
});