//  --- requirements ---
require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth-routes');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys')
const cookieSession = require('cookie-session');
const passport = require('passport');

//  --- middleware ---
const app = express();

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// app.options(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());




// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });


//makes sure the cookie is just a day long
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [keys.session.cookieKey]
}));

//init passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

//  --- endpoints ---
app.get('/', (req, res) => {
    console.log("GET /");
    res.send('Hello, world!')
});

app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  

//  --- export ---
module.exports = app;

