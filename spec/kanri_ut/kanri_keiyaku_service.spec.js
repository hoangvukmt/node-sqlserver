'use strict';

var expect = require('chai').expect;
var app = require('../../app');
const request = require('supertest');
const resCode = require('../../api/util/validation').RESPONSE_CODE;
const systemConfig = require('config');

describe('POST /kanri/api/getListProductByUser - TEST getListProductByUser',  function(){
    let api_url = '/kanri/api/getListProductByUser';
    it('Response for request without parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Keiyaku parameter(s) is required!');
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

describe('POST /kanri/api/getProductDetail - TEST getProductDetail',  function(){
    let api_url = '/kanri/api/getProductDetail';
    it('Response for request without parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('KeiyakuNo parameter(s) is required!');
        })
    });
    it('Response for request with valid parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({keiyaku_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
})

describe('POST /kanri/api/sendKeiToSystem - TEST sendKeiToSystem',  function(){
    let api_url = '/kanri/api/sendKeiToSystem';
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
    it('Response for request with only user_no parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with only iq_customer_no parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({iq_customer_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with valid parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1, iq_customer_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Update success!');
        })
    });
})