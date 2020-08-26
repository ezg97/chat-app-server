/*const router = require('express').Router();
const passport = require('passport');
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;


const jsonParser = express.json();



require('dotenv').config();

const keys = require('../config/keys');
const UserService = require('../config/passport-setup-service');
const knex = require('knex');
const { DATABASE_URL } = require('../config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL,
  });

//Endpoint: Called for authorization, middleware: authCheck is called, user data sent to client
router.get('/', (req, res,next) => {
    console.log("auth//// /");
    console.log(JSON.stringify(req.user));
    //let response = { mail: { message: 'got it' }}

    res.send(req.user);
  });

// auth logout
router.get('/out', (req, res) => {
    // handle with passport
    req.logout();
    res.send(JSON.stringify('logging out'));
});

// PASSPORT STRATEGY
// ---------------------------------------

passport.use(
    new LocalStrategy({
        usernameField: 'email', 
        passwordField: 'password',
        passReqToCallback: true
    }), 
    function (req, username, password, done) {
        console.log('LOCAL STRATEGY');
        //check if user exists in database
        UserService.hasUserWithEmail(db, email)
        .then(currentUser => {
            //If the user is in the database then pass them into the callback function
            if (currentUser) {
                console.log('USING USER');
                UserService.comparePasswords(password, currentUser.password)
                .then(compareMatch => {
                    if(!compareMatch){
                        return done(null, {message: 'Password Incorrect'});
                    }
                    else{
                        //user is authenticated
                        return done(null, currentUser);
                    }
                });
            }
            if(newAccount) {
                console.log('LOCAL: CREATING USER');
                //Initialize the user object with the profile and email info
                const user = { 
                    user_name: displayName,
                    // user_thumbnail: profile._json.picture,
                    user_email: email,
                    user_password: password
                }
                
                // Add user to database
                UserService.addUser(db, user).then(newUser => {
                    console.log('LOCAL: New User Created:' + newUser);
                    //Call the callback function
                    return done(null,newUser);
                });
            }
            return done(null, {});
     
            //maybe done(null,{});
        });
});
// ---------------------------------------


router.post('/login/:data', (req, res, next) => {
    console.log('in sign in');
    //console.log(req);
    console.log(req.body);
    console.log(req.params.data);
    //app.set('body', req.body);

    res.redirect(302, '/local/auth')

})
//passport.authenticate('local'), (req,res) => {
router.post('/auth', (req, res, next) => {
    console.log('LOCAL CUSTOM REDIRECT');
    passport.authenticate(['local'], {
        session: true,
        failureRedirect: '/testF',
        successRedirect: '/testS',
    })(req,res,next);
    console.log('passport user', req.user);
    if(req.user){
        res.send(req.user);
    }
    else{
        console.log('failed, no req.user');
        res.send({});
    }
});

router.get('/testF', (req,res) => {
    console.log('failed');
});

router.get('/testS', (req,res) => {
    console.log('passed');
})



//Serialize the user id
passport.serializeUser( (user, done) => {
    console.log('LOCAL: in serialize');
    done(null, user.user_email);//id in the database
});

passport.deserializeUser( (email, done) => {
    //find the user id in the database
    console.log('LOCAL: in DEserialize **');
    console.log('LOCAL: email: ', email);
    //Locating the user in the database
    UserService.hasUserWithEmail(
        db,
        email,
    )
    .then(userInfo => {
        console.log('LOCAL: returned from service: ', userInfo);
        //If the user exists then pass into the callback function, else, pass in empty object
        if(userInfo) done(null, userInfo);
        else done(null,{});
    })
    .catch (err => {
        console.error('LOCAL: ERROR THROWN trying to access database: ', err);
    });
});


module.exports = router;*/