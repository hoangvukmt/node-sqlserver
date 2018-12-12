var expect = require('chai').expect;
var app = require('../../app');
const request = require('supertest');
const resCode = require('../../api/util/validation').RESPONSE_CODE;
const systemConfig = require('config');

describe('POST /kanri/api/getListFileUpload - TEST getListFileUpload',  function(){
    let api_url = '/kanri/api/getListFileUpload';    
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
    it('Response for request with valid parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({group_id: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
});

describe('POST /kanri/api/getListImage - TEST getListImage',  function(){
    let api_url = '/kanri/api/getListImage';    
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
    it('Response for request with only user_no parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with only keiyaku_no parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({keiyaku_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with valid parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({user_no: 1, keiyaku_no: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });
});

describe('GET /kanri/api/getFileImg - TEST getFileImg',  function(){     
    let api_url = '/kanri/api/getFileImg';
    it('Response for request without parameter supplied', async function(){
        let test = request(app)
            .get(api_url)
            .set('Accept', 'application/json')            
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with valid invalid token and valid parameters supplied', async function(){
        let test = request(app)
            .get(api_url + "?group_id=42&file_id=2&token=aa")
            .set('Accept', 'application/json')            
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('Failed to authenticate token.');
        })
    }); 
    it('Response for request with valid token and parameters supplied', async function(){
        let test = request(app)
            .get(api_url + "?group_id=42&file_id=2&token=" + process.env.token)
            .set('Accept', 'application/json')            
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });  
});

describe('POST /kanri/api/deleteFileUpload - TEST deleteFileUpload',  function(){
    let api_url = '/kanri/api/deleteFileUpload';    
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
    it('Response for request with only group_id parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({group_id: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with only file_id parameter supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({file_id: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with valid parameters supplied', async function(){
        let test = request(app)
            .post(api_url)
            .set('Accept', 'application/json')
            .send({group_id: 1, file_id: 1});
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Delete successed!');
        })
    });
});

describe('POST /kanri/api/uploadFileRelation - TEST uploadFileRelation',  function(){
    let api_url = '/kanri/api/uploadFileRelation';    
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

describe('GET /kanri/api/getFileRelation - TEST getFileRelation',  function(){     
    let api_url = '/kanri/api/getFileRelation';
    it('Response for request without parameter supplied', async function(){
        let test = request(app)
            .get(api_url)
            .set('Accept', 'application/json')            
        await test.then(res => {
            expect(res.body.code).equal(resCode.REQUIRED);
            expect(res.body.message).equal('Parameter(s) is required!');
        })
    });
    it('Response for request with valid invalid token and valid parameters supplied', async function(){
        let test = request(app)
            .get(api_url + "?user_no=1&file_name=aaa&token=aa")
            .set('Accept', 'application/json')            
        await test.then(res => {
            expect(res.body.code).equal(resCode.AUTH_FAIL);
            expect(res.body.message).equal('Failed to authenticate token.');
        })
    }); 
    it('Response for request with valid token and parameters supplied', async function(){
        let test = request(app)
            .get(api_url + "?user_no=1&file_name=aaa&token=" + process.env.token)
            .set('Accept', 'application/json')            
        await test.then(res => {
            expect(res.body.code).equal(resCode.SUCCESS);
            expect(res.body.message).equal('Get successed!');
        })
    });  
});