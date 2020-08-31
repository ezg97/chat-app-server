require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const GithubStrategy = require('passport-github2');
const TwitchStrategy = require("@d-fischer/passport-twitch").Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const keys = require('./keys');
const UserService = require('./passport-setup-service');
const knex = require('knex');
const { DATABASE_URL } = require('../config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL,
  });

//Serialize the user id
passport.serializeUser( (user, done) => {
    //console.log('in serialize');
    done(null, user.user_id);//id in the database
});

passport.deserializeUser( (id, done) => {
    //find the user id in the database
    //console.log('in DEserialize **');
    //console.log('ID: ', id);
    //Locating the user in the database
    UserService.hasUserWithUserId(
        db,
        id,
    )
    .then(userInfo => {
        //console.log('returned from service: ', userInfo);
        //If the user exists then pass into the callback function, else, pass in empty object
        if(userInfo) done(null, userInfo);
        else done(null,{});
    })
    .catch (err => {
        console.error('ERROR THROWN trying to access database: ', err);
    });
});

passport.use(
    new GoogleStrategy({
        //options for the google strategy
        callbackURL: '/auth/rggl/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //passport call back function
        
        //check if user exists in database
        UserService.hasUserWithUserId(db, profile.id).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            if (currentUser) {
                //console.log('USING USER');
                done(null, currentUser);
            }
            else {
                //console.log('CREATING USER');
                //Initialize the user object with the profile and email info
                const user = { 
                    user_name: profile.displayName,
                    user_id: profile.id,
                    user_thumbnail: profile._json.picture,
                    user_email: profile._json.email
                }
                
                // Add user to database
                UserService.addUser(db, user).then(newUser => {
                    //console.log('New User Created:' + newUser);
                    //Call the callback function
                    done(null,newUser);
                });
                
            }
        })
        //if exists, retrieve info

    
    })
);

passport.use(
    new GithubStrategy({
        //options for the google strategy
        callbackURL: '/auth/rgh/redirect',
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        scope: ['user:email'],
    }, (accessToken, refreshToken, profile, done) => {
        //passport call back function
        
        //check if user exists in database
        UserService.hasUserWithUserId(db, profile.id).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            //console.log('githubbbbbb');
            if (currentUser) {
                //console.log('USING USER');
                done(null, currentUser);
            }
            else {
                //console.log('CREATING USER');
                //console.log(profile);
                //Initialize the user object with the profile and email info
                const user = { 
                    user_name: profile.displayName,
                    user_id: profile.id,
                    user_thumbnail: profile.photos[0].value,
                    user_email: profile.emails[0].value
                }
                
                // Add user to database
                UserService.addUser(db, user).then(newUser => {
                    //console.log('New User Created:' + newUser);
                    //console.log(Object.values(newUser));
                    //console.log('New User Created:' + {newUser});

                    //Call the callback function
                    done(null,newUser);
                });
                
            }
        })
        //if exists, retrieve info

    
    })
);


passport.use(
    new TwitchStrategy({
        //options for the google strategy
        callbackURL: 'https://protected-taiga-95742.herokuapp.com/auth/twitch/redirect',
        clientID: keys.twitch.clientID,
        clientSecret: keys.twitch.clientSecret,
        // scope: ['user_read'],
    }, (accessToken, refreshToken, profile, done) => {
        //passport call back function
        //console.log('made it to twitchhhh');
        //console.log('user', profile);
        //check if user exists in database
        UserService.hasUserWithUserId(db, profile.id).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            //console.log('twitcheru');
            if (currentUser) {
                //console.log('USING USER');
                done(null, currentUser);
            }
            else {
                //console.log('CREATING USER');
                //console.log(profile);
                //Initialize the user object with the profile and email info
                const user = { 
                    user_name: profile.display_name,
                    user_id: profile.id,
                    user_thumbnail: profile.profile_image_url,
                    user_email: profile.email
                }
                
                // // Add user to database
                UserService.addUser(db, user).then(newUser => {
                    //console.log('New User Created:' + newUser);
                    //console.log(Object.values(newUser));
                    //console.log('New User Created:' + {newUser});

                    //Call the callback function
                    done(null,newUser);
                });
                
            }
        })
        //if exists, retrieve info

    
    })
);

passport.use(
    new LinkedInStrategy({
        //options for the google strategy
        callbackURL: 'https://protected-taiga-95742.herokuapp.com/auth/linkedin/redirect',
        clientID: keys.linkedIn.clientID,
        clientSecret: keys.linkedIn.clientSecret,
        scope: ['r_liteprofile', 'r_emailaddress']
        // scope: ['user_read'],
    }, (accessToken, refreshToken, profile, done) => {
        //passport call back function
        //console.log('made it to linkedIn account');
        //console.log('user', profile);
        //check if user exists in database
        UserService.hasUserWithUserId(db, profile.id).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            if (currentUser) {
                //console.log('USING USER');
                done(null, currentUser);
            }
            else {
                //console.log('CREATING USER');
                //console.log(profile);
                //Initialize the user object with the profile and email info
                const user = { 
                    user_name: profile.displayName,
                    user_id: profile.id,
                    user_thumbnail: profile.photos[0].value,
                    user_email: profile.email
                }
                
                // // Add user to database
                UserService.addUser(db, user).then(newUser => {
                    //console.log('New User Created:' + newUser);
                    //console.log(Object.values(newUser));
                    //console.log('New User Created:' + {newUser});

                    //Call the callback function
                    done(null,newUser);
                });
                
            }
        })
        //if exists, retrieve info

    
    })
)