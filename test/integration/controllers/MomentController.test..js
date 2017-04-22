var request = require('supertest');
var should = require('should')
describe('MomentController unit test', function () {
  function findTest(cb) {
    request(sails.hooks.http.app)
      .get('/api/moment?sort=createdAt DESC&limit=10')
      .end(function (err, res) {
        should.not.exist(err)
        return cb(res)
      })
    return
  }
  it('result should an array', function (done) {
    findTest(function (res) {
      res.body.should.be.an.Array()
      done()
    })
  });
  it('result item should have comments property and should an array', function (done) {
    findTest(function (res) {
      res.body[0].should.have.property('comments')
      res.body[0].comments.should.be.an.Array()
      done()
    })
  });
   it('result item should have images property and should an array', function (done) {
    findTest(function (res) {
      res.body[0].should.have.property('images')
      res.body[0].comments.should.be.an.Array()
      done()
    })
  });
  it('result item should have user property and should be an object', function (done) {
    findTest(function (res) {
      res.body[0].should.have.property('user')
      res.body[0].user.should.be.an.Object()
      done()
    })
  });
  it('result item should have user property and should be an object and should have name property', function (done) {
    findTest(function (res) {
      res.body[0].should.have.property('user')
      res.body[0].comments.should.be.an.Object()
      res.body[0].user.should.have.property('name')
      done()
    })
  });
});