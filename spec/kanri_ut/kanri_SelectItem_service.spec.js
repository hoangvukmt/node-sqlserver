'use strict';

var expect = require('chai').expect;
var app = require('../../app');
const request = require('supertest');
const resCode = require('../../api/util/validation').RESPONSE_CODE;
const systemConfig = require('config');

describe('POST /kanri/api/getListSelectItem - TEST getListSelectItem',  function(){
    let api_url = '/kanri/api/getListSelectItem';    
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
    it('Response for request with valid parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({sel_type: 'aaa'});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
});