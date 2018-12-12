'use strict';

var expect = require('chai').expect;
var app = require('../../app');
const request = require('supertest');
const resCode = require('../../api/util/validation').RESPONSE_CODE;
const systemConfig = require('config');

describe('POST /kanri/api/searchHaishinLog - TEST searchHaishinLog',  function(){
    let api_url = '/kanri/api/searchHaishinLog';    
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
});

describe('POST /kanri/api/getHaishinLogDetail - TEST getHaishinLogDetail',  function(){
    let api_url = '/kanri/api/getHaishinLogDetail';    
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
            .send({haishin_id: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
});

describe('POST /kanri/api/haishinLogUpload - TEST haishinLogUpload',  function(){
    let api_url = '/kanri/api/haishinLogUpload';    
    it('Response for request without parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });    
});

describe('POST /kanri/api/createHaishinlog - TEST createHaishinlog',  function(){
    let api_url = '/kanri/api/createHaishinlog';    
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
            .send({
                target_f: "",                
                kanyushite_f: "",                
                kikan_f: "",                
                target_count: "",
                message_title: "",
                message: "",                
                tanto_name: ""
            });
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Create successed!');
        })
    });    
});