const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('./config/db');

const app = express();
let port = process.env.PORT || 3001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//route
var usersRouter = require('./routes/users');
app.use(usersRouter);

app.listen(port, () => console.log(`Server up on port ${port}`));
