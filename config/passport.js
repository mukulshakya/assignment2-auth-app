const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function(passport){
  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('entered passport')
      User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }

        if (!user) {
          console.log('incorrect email')
          return done(null, false, { message: 'Incorrect email.' });
        }

        bcrypt.compare(password, user.password, function(err, isMatch) {
            if(err) throw err;
            if(isMatch){
              console.log('password matched');
              return done(null, user);
            } 
            else {
              console.log('wrong password');
              return done(null, false, {message: 'Wrong password'});
            }
        });
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  // passport.deserializeUser(function(id, done) {
  //   User.findById(id, function(err, user) {
  //     done(err, user);
  //   });
  // });

}
