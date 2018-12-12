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

describe('POST /kanri/api/searchRiyo - TEST searchRiyo',  function(){
    let api_url = '/kanri/api/searchRiyo';
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
            .send({user_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
})