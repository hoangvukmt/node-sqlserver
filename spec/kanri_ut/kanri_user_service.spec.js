var expect = require('chai').expect;
var app = require('../../app');
const request = require('supertest');
const resCode = require('../../api/util/validation').RESPONSE_CODE;
const systemConfig = require('config');

describe('POST /kanri/api/login - TEST LOGIN',  function(){    
    it('Response for Login without parameter', async function(){
        let test = request(app)
            .post('/kanri/api/login')
            .set('Accept', 'application/json')
            .send({})
        await test.then(res => {                
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for Login with only one parameter supplied', async function(){
        let test = request(app)
            .post('/kanri/api/login')
            .set('Accept', 'application/json')
            .send({login_id: 'not@not'})
        await test.then(res => {                
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for Login with only one parameter supplied', async function(){
        let test = request(app)
            .post('/kanri/api/login')
            .set('Accept', 'application/json')
            .send({password: '...sfasdfsdf'})
        await test.then(res => {                
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for Login with not exist user parameter', async function(){
        let test = await request(app)
            .post('/kanri/api/login')
            .set('Accept', 'application/json')            
            .send({login_id: 'not@not.com', password:'...sfasdfsdf'})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('LoginId/Password incorrect!');
        })
    });
    it('Response for Login with OutOfDate user parameter', async function(){
        let test = await request(app)
            .post('/kanri/api/login')
            .set('Accept', 'application/json')            
            .send({login_id: 'ashori', password:'ashori'})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('OutOfDate');
        })
    });

    it('Response for Login with wrong password of ' + systemConfig.get('TestENV.utTestAcc.login_id'), async function(){
        let test = await request(app)
            .post('/kanri/api/login')
            .set('Accept', 'application/json')            
            .send({login_id: systemConfig.get('TestENV.utTestAcc.login_id'), password:'...sfasdfsdf'})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('LoginId/Password incorrect!');
        })
    });

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