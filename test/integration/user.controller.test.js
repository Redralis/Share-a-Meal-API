const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

chai.should();
chai.use(chaiHttp);

describe('Manage users', () => {
  describe('UC-201 - Register as a new user /api/user', () => {
    it('TC-201-1 - When a required input is missing, a valid error should be returned', (done) => {
        chai
        .request(server)
        .post('/api/user')
        .send({
          //First name is missing
          "lastName": "Doe",
          "street": "Hogeschoollaan 61",
          "city": "Breda",
          "password": "secret",
          "emailAdress": "jane.doe@mail.com"
        })
        .end((err, res) => {
          res.should.be.an('object');
          let {status, result} = res.body;
          status.should.equals(400);
          result.should.be.a('string').that.equals('First name must be a string');
        })
      done();
    });
  });
});