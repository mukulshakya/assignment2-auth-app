var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const {auth} = require('../config/auth');

router.get('/', auth(), (req, res) => {
  res.render('welcome', {username: req.session.passport.user.username});
});

// Register Form
router.get('/register', (req, res) => {
  res.render('register', {title: 'Register'});
});

// Register Process
router.post('/register',async (req, res) => {

  let duplicateUser = await User.findOne({username: req.body.username});
  
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
router.get('/login', (req, res) => {
  res.render('login', {title: 'Login'});
});

// Login Process
router.post('/login',  passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.send({login: 'success'});
});

// Forgot password Form
router.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword', {title: 'Forgot password'});
});

// Forgot password process
router.post('/forgotpassword', async (req, res) => {
  let user = await User.findOne({username: req.body.username});

  if(!user) {
    res.send({msg:"danger",msg1:"username not valid"})
  }
  else {
    bcrypt.compare(req.body.oldPassword, user.password, function(err, isMatch) {
      if(err) throw err;
      if(isMatch){
        console.log('old password matched');
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(req.body.newPassword, salt, function(err, hash){
            if(err){
              return res.send({msg:"danger",msg1:"some error occurred"});
            }
    
            // let newUser = new User({username: req.body.username, password: hash});
            user.password = hash;
    
            user.save()
              .then((user) => {
                console.log(user);
                res.send({msg:"success",msg1:"Password updated"});
              })
              .catch((err) => {
                console.log(err);
                res.send({msg:"danger",msg1:"please try again"});
              });
          });
        }); 
      } 
      else {
        console.log('old wrong password');
        res.send({msg:"danger",msg1:"old password incorrect"});
      }
    });
  }
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


module.exports = router;
