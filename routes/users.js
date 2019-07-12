var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const {auth} = require('../config/auth');


/* GET users listing. */
router.get('/', auth(), (req, res, next) => {
  res.render('welcome', {username: req.session.passport.user.username});
});

// Register Form
router.get('/register', (req, res) => {
  res.render('register', {title: 'Register'});
});

// Register Process
router.post('/register',async (req, res) => {

  let duplicateUser = await User.findOne({username: req.body.username});
  
  // User.findOne({username: req.body.username}).then((user) => {
  //   if(user) return res.send({msg:"danger",msg1:"username not available"});
  // }).catch(() => {
  //   return res.send({msg:"danger",msg1:"Unexpected error"});
  // });
  if(duplicateUser) {
    res.send({msg:"danger",msg1:"username not available"});
  }
  else {
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(req.body.password, salt, function(err, hash){
        if(err){
          res.send({msg:"danger",msg1:"some error occurred"});
        }

        let newUser = new User({username: req.body.username, password: hash});

        newUser.save()
          .then((user) => {
            console.log(user);
            res.send({msg:"success",msg1:"Registered.. "});
          })
          .catch((err) => {
            console.log(err);
            res.send({msg:"danger",msg1:"please try again"});
          });    
      });
    }); 
  }
});


// Login Form
router.get('/login', function(req, res){
  res.render('login', {title: 'Login'});
});

// Login Process
router.post('/login',  passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


module.exports = router;
