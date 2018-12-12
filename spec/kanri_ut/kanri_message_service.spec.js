'use strict';

var expect = require('chai').expect;
var app = require('../../app');
const request = require('supertest');
const resCode = require('../../api/util/validation').RESPONSE_CODE;
const systemConfig = require('config');

describe('POST /kanri/api/login - LOGIN FIRST',  function(){
    it('Response for login with validate account: '+ systemConfig.get('TestENV.utTestAcc.login_id') + ',password='+ systemConfig.get('TestENV.utTestAcc.password'), async function(){
        let test = request(app)
            .post('/kanri/api/login')
            .set('Accept', 'application/json')            
            .send({login_id: systemConfig.get('TestENV.utTestAcc.login_id'), password: systemConfig.get('TestENV.utTestAcc.password')});
        await test.then(res => {
            expect(res.body.code).to.be.equal(resCode.SUCCESS);
        })
    });
});

describe('POST /kanri/api/getListMessage - TEST getListMessage',  function(){
    let api_url = '/kanri/api/getListMessage';
    it('Response for request without parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with valid parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1, message_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
})

describe('POST /kanri/api/searchMessage - TEST searchMessage',  function(){
    let api_url = '/kanri/api/searchMessage';    
    it('Response for request with valid parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
})

describe('POST /kanri/api/sendMessage - TEST sendMessage',  function(){
    let api_url = '/kanri/api/sendMessage';    
    it('Response for request without parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with one parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with one parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({message_type: 0});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with one parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({message_title: 'aaa'});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with two parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1, message_type: 0});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with two parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1, message_title: 'aaa'});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with two parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({message_type: 0, message_title: 'aaa'});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with valid parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1, message_type: 0, message_title: 'aaa'});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Send successed!');
        })
    });    
});

describe('POST /kanri/api/messageImageUpload - TEST messageImageUpload',  function(){
    let api_url = '/kanri/api/messageImageUpload';    
    it('Response for request without parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
});

describe('GET /kanri/api/getMessageImg - TEST getMessageImg',  function(){
    let api_url = '/kanri/api/getMessageImg';    
    it('Response for request without parameter supplied and invalid token', async function(){
        let test = request(app)
            .get(api_url + '?token=notvalidtoken')
            .set('Accept', 'application/json')            
            .send({});
        await test.then(res => {
            expect(res.body.code).equal('401');
            expect(res.body.message).equal('Failed to authenticate token.');
        })
    });
    it('Response for request without parameter supplied and no token', async function(){
        let test = request(app)
            .get(api_url)
            .set('Accept', 'application/json')            
            .send({});
        await test.then(res => {
            expect(res.body.code).equal('401');
            expect(res.body.message).equal('No token provided.');
        })
    });
    it('Response for request without parameter supplied and valid token', async function(){
        let test = request(app)
            .get(api_url + '?token=' + process.env.token)
            .set('Accept', 'application/json')            
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with valid parameter supplied and valid token', async function(){
        let test = request(app)
            .get(api_url + '?file_id=1&token=' + process.env.token)
            .set('Accept', 'application/json')            
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
});