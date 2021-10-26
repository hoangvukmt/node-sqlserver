var expect = require('chai').expect;
const db = require('../../api/util/db_util');
describe('connectDB',   function(){
    it('connect to DB....', async function(){
        let test = await db.dbConnect();
        // console.log(test);
        expect(test).to.has.property('ConnectionPool');
    });
});
//make connection to DB - call one time when start test
//require all test file to make test order in mocha

require('./kanri_user_service.spec');