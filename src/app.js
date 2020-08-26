//  --- requirements ---
require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const localRoutes = require('./routes/local-auth-routes');

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
var bodyParser = require('body-parser')



// Add headers
// app.options(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

// app.options(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });
// app.options('http://localhost:3000', cors())// located here fixed this: "OPTIONS / HTTP/1.1" 204 0 

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
//app.use(cors());
app.use(cors({
  origin : 'http://localhost:3000',//localhost:3000 (Whatever your frontend url is) 
  credentials: true, // <= Accept credentials (cookies) sent by the client
}));


app.use(bodyParser.urlencoded({
  extended: true
}));

// app.options(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
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


// res.header("Access-Control-Allow-Origin", "http://localhost:3000");


// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

// app.all('*',  (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');


//   res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
// res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
// next();
// });
//console.log('local');
//app.use('/local', localRoutes);
console.log('auth');
app.use('/auth', authRoutes);
console.log('going to user');
app.use('/user', userRoutes);

//  --- endpoints ---
app.get('/', (req, res,next) => {
  console.log("GETzzzz /");
  let response = { mail: { message: 'got it' }}

  res.send(JSON.stringify('HELLO WORLD!!!'))
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

