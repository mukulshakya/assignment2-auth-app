var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const {auth} = require('../config/auth');
const {mailFunc} = require('../config/nodemailer');

router.get('/', auth(), (req, res) => {
  res.render('welcome', {email: req.session.passport.user.email});
});

// Register Form
router.get('/register', (req, res) => {
  res.render('register', {title: 'Register'});
});

// Register Process
router.post('/register',async (req, res) => {

  let duplicateUser = await User.findOne({email: req.body.email});
  
  if(duplicateUser) {
    res.send({msg:"danger",msg1:"email already taken"});
  }
  else {
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(req.body.password, salt, function(err, hash){
        if(err){
          res.send({msg:"danger",msg1:"some error occurred"});
        }

        let newUser = new User({email: req.body.email, password: hash});

        newUser.save()
          .then((user) => {
            res.send({msg:"success",msg1:"Registered.. "});

            let mailData = {
              email: user.email,
              subject: 'Registration Succesful',
              mailbody: 'Hi, you\'ve been registered succesfully on Assignment 2 on',
            }
            mailFunc(mailData);
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
  let mailData = {
    email: req.session.passport.user.email,
    subject: 'Login Notification',
    mailbody: 'Hi, new login detected on Assignment 2 on',
  }
  mailFunc(mailData);
});

// Forgot password Form
router.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword', {title: 'Forgot password'});
});

// Forgot password process
router.post('/forgotpassword', async (req, res) => {
  let user = await User.findOne({email: req.body.email});

  if(!user) {
    res.send({msg:"danger",msg1:"email not valid"})
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
    
            user.password = hash;

            user.save()
              .then((user) => {
                res.send({msg:"success",msg1:"Password updated"});

                let mailData = {
                  email: user.email,
                  subject: 'Password Updated',
                  mailbody: 'Hi, your password have been updated on Assignment 2 on',
                }
                mailFunc(mailData);
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
