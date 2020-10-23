    process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
chai = require('chai'),
chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
chai.config.includeStack = true;

var should = chai.should(),
assert = chai.assert,
expect = chai.expect;

var server = require('../src/index'),
Openings = require('../src/models/openings');

describe('API testing', function(){
  it('should return status 200 on homepage GET', function(done){
    chai.request(server)
    .get('/')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    })
  });

  it('should sign in on /signin POST', function(done) {
    chai.request(server)
    .post('/signin')
    .send({'email': 'abc@test.com','password':'123456'})
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });

  it('should list the openings on /openingsList GET', function(done) {
    chai.request(server)
    .get('/openingsList')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
})

