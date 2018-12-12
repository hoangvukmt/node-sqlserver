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

describe('POST /kanri/api/searchCustomer - TEST searchCustomer',  function(){
    it('Response for searchCustomer without parameter', async function(){
        let test = request(app)
            .post('/kanri/api/searchCustomer')
            .set('Accept', 'application/json')
            .send({})
        await test.then(res => {                
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
});

describe('POST /kanri/api/getUserInfo - TEST getUserInfo',  function(){
    it('Response for getUserInfo without parameter', async function(){
        let test = request(app)
            .post('/kanri/api/getUserInfo')
            .set('Accept', 'application/json')
            .send({})
        await test.then(res => {                
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for getUserInfo with not exist user parameter', async function(){
        let test = request(app)
            .post('/kanri/api/getUserInfo')
            .set('Accept', 'application/json')            
            .send({login_id: 'not@not.com'})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.NOT_EXIST);
            expect(res.body.message).equal('User do not exist!');
        })
    });
    it('Response for getUserInfo with out of date user parameter', async function(){
        let test = request(app)
            .post('/kanri/api/getUserInfo')
            .set('Accept', 'application/json')            
            .send({login_id: 'ashori'})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('OutOfDate');
        })
    });
    it('Response for getUserInfo with exist user parameter', async function(){
        let test = request(app)
            .post('/kanri/api/getUserInfo')
            .set('Accept', 'application/json')            
            .send({login_id: systemConfig.get('TestENV.utTestAcc.login_id')})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.SUCCESS);
        })
    });
});

describe('POST /kanri/api/updateCustomer - TEST updateCustomer',  function(){
    it('Response for updateCustomer without parameter', async function(){
        let test = request(app)
            .post('/kanri/api/updateCustomer')
            .set('Accept', 'application/json')
            .send({})
        await test.then(res => {                
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for updateCustomer with validate parameter', async function(){
        let test = request(app)
            .post('/kanri/api/updateCustomer')
            .set('Accept', 'application/json')            
            .send({user_no: 1})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Update successed!');
        })
    });    
});

describe('POST /kanri/api/deleteCustomer - TEST deleteCustomer',  function(){
    it('Response for deleteCustomer without parameter', async function(){
        let test = request(app)
            .post('/kanri/api/deleteCustomer')
            .set('Accept', 'application/json')
            .send({})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for deleteCustomer with validate parameter', async function(){
        let test = request(app)
            .post('/kanri/api/deleteCustomer')
            .set('Accept', 'application/json')           
            .send({user_no: 1})
        await test.then(res => {                
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Delete successed!');
        })
    });    
});

describe('POST /kanri/api/searchTargetCustomer - TEST searchTargetCustomer',  function(){
    it('Response for searchTargetCustomer without parameter', async function(){
        let test = request(app)
            .post('/kanri/api/searchTargetCustomer')
            .set('Accept', 'application/json')
            .send({})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });       
});

describe('POST /kanri/api/getCustomerInfo - TEST getCustomerInfo',  function(){
    it('Response for getCustomerInfo without parameter', async function(){
        let test = request(app)
            .post('/kanri/api/getCustomerInfo')
            .set('Accept', 'application/json')
            .send({})            
        await test.then(res => {                
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for getCustomerInfo with validate parameter', async function(){
        let test = request(app)
            .post('/kanri/api/getCustomerInfo')
            .set('Accept', 'application/json')           
            .send({user_no: 1})
        await test.then(res => {                
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Delete successed!');
        })
    });    
});