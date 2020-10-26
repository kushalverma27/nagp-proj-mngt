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

describe('Crud on Openings', function(){
	beforeEach(function(done){
		var testData = new Openings({
		  project: 'test project',
      title: 'test title',
      client: 'test client',
      technologies: 'test',
      desc: 'test',
		});
    testData.save(function(err) {
      done();
    });
  });
  afterEach(function(done){
		Model.collection.remove(testData);
		done();
	});

});


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

it('should logout user on /logout GET', function(done) {
  chai.request(server)
  .get('/logout')
  .end(function(err, res){
    res.should.have.status(200);
    done();
  });
});

it('should display profile of user on /profile GET', function(done) {
  chai.request(server)
  .get('/profile')
  .end(function(err, res){
    res.should.have.status(200);
    done();
  });
});

it('should fetch opening details on /openingDetails/:_id GET', function(done) {
  chai.request(server)
  .get('/openingDetails/5f8c60bd00fca459e49d896e')
  .end(function(err, res){
    res.should.have.status(200);
    done();
  });
});

})