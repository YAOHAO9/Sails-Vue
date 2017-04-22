var sails = require('sails');

before(function (done) {

  sails.lift({
    // configuration for testing purposes
  }, function (err) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    setTimeout(function () {
      done(err, sails)
    }, 3000)
  });
});

after(function (done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});