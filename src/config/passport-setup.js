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
    done(null, user.user_email);//id in the database
});

passport.deserializeUser( (email, done) => {
    //find the user id in the database
    //console.log('in DEserialize **');
    //console.log('email: ', email);
    //Locating the user in the database
    UserService.hasUserWithEmail(
        db,
        email,
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
        UserService.hasUserWithEmail(db, profile._json.email).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            if (currentUser) {
                //console.log('USING USER');
                
                //compare the ID that the user in the database has with the ID
                return UserService.compareIds(profile.id, currentUser.user_id)
                    .then(compareMatch => {
                        //if the password doesn't match
                        //if (compareMatch) {
                            //Call the callback function
                            //no if, because if they matched I could send the below, but if they dont match then I would need to grab every account with this email
                            // and check each password... doable, but i'm not gonna do that right now!
                            done(null, currentUser);
                       // }
                      //  else {
                        //    done(null, {});
                      //   }
                }).catch((error) => {
                    console.log('Error - ps-Google-CI: ', error);
                });
            }
            else {
                //console.log('CREATING USER');
                //console.log(profile);

                    
                UserService.hashId(profile.id)
                    .then(hashedId => {

                        const user = { 
                            user_name: profile.displayName,
                            user_id: hashedId,
                            user_thumbnail: profile._json.picture,
                            user_email: profile._json.email
                        }
                                                    
                         // Add user to database
                        UserService.addUser(db, user).then(newUser => {                
                            //Call the callback function
                             done(null,newUser);
                        }).catch((error) => {
                            console.log('Error - ps-Google-AU: ', error);
                        });
                }).catch((error) => {
                    console.log('Error - ps-Google-HI: ', error);
                });
            }
        }).catch((error) => {
            console.log('Error - ps-Google-HUWE: ', error);
        });
        //if exists, retrieve info

    
    })
);

passport.use(
    new GithubStrategy({
        //options for the google strategy
        callbackURL: 'https://protected-taiga-95742.herokuapp.com/auth/rgh/redirect',
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        scope: ['user:email'],
    }, (accessToken, refreshToken, profile, done) => {
        //passport call back function
        UserService.hasUserWithEmail(db, profile.emails[0].value).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            if (currentUser) {
                //console.log('USING USER');
                
                //compare the ID that the user in the database has with the ID
                return UserService.compareIds(profile.id, currentUser.user_id)
                    .then(compareMatch => {
                        //if the password doesn't match
                       // if (compareMatch) {
                            //Call the callback function
                            done(null, currentUser);
                        // }
                        // else {
                        //     done(null, {});
                        //  }
                }).catch((error) => {
                    console.log('Error - ps-GitHub-CI: ', error);
                });
            }
            else {
                //console.log('CREATING USER');
                //console.log(profile);

                    
                UserService.hashId(profile.id)
                    .then(hashedId => {
                        
                        const user = { 
                            user_name: profile.displayName,
                            user_id: hashedId,
                            user_thumbnail: profile.photos[0].value,
                            user_email: profile.emails[0].value,
                        }
                                                    
                         // Add user to database
                        UserService.addUser(db, user).then(newUser => {                
                            //Call the callback function
                             done(null,newUser);
                        }).catch((error) => {
                            console.log('Error - ps-GitHub-AU: ', error);
                        });
                }).catch((error) => {
                    console.log('Error - ps-GitHub-HI: ', error);
                });
            }
        }).catch((error) => {
            console.log('Error - ps-GitHub-HUWE: ', error);
        });
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
        ////console.log('made it to twitchhhh');
        //console.log('user', profile);
        //check if user exists in database
        UserService.hasUserWithEmail(db, profile.email).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            if (currentUser) {
                //console.log('USING USER');
                
                //compare the ID that the user in the database has with the ID
                return UserService.compareIds(profile.id, currentUser.user_id)
                    .then(compareMatch => {
                        //if the password doesn't match
                       // if (compareMatch) {
                            //Call the callback function
                            done(null, currentUser);
                        // }
                        // else {
                        //     done(null, {});
                        //  }
                }).catch((error) => {
                    console.log('Error - ps-Twitch-CI: ', error);
                });
            }
            else {
                //console.log('CREATING USER');
                //console.log(profile);

                    
                UserService.hashId(profile.id)
                    .then(hashedId => {
                        const user = { 
                            user_name: profile.display_name,
                            user_id: hashedId,
                            user_thumbnail: profile.profile_image_url,
                            user_email: profile.email
                        }
                                                    
                         // Add user to database
                        UserService.addUser(db, user).then(newUser => {                
                            //Call the callback function
                             done(null,newUser);
                        }).catch((error) => {
                            console.log('Error - ps-Twitch-HI: ', error);
                        });
                }).catch((error) => {
                    console.log('Error - ps-Twitch-HI: ', error);
                });
            }
        }).catch((error) => {
            console.log('Error - ps-Twitch-HUWE: ', error);
        });
       
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
        ////console.log('made it to linkedIn account');
        //console.log('user', profile);
        //check if user exists in database
        /*profile.id*/
        let email = (profile.displayName + profile.photos[0].value);
        UserService.hasUserWithEmail(db, email).then(currentUser => {
            //If the user is in the database then pass them into the callback function
            if (currentUser) {
                //console.log('USING USER');
                
                //compare the ID that the user in the database has with the ID
                return UserService.compareIds(profile.id, currentUser.user_id)
                    .then(compareMatch => {
                        //if the password doesn't match
                       // if (compareMatch) {
                            //Call the callback function
                            done(null, currentUser);
                        // }
                        // else {
                        //     done(null, {});
                        //  }
                }).catch((error) => {
                    console.log('Error - ps-LinkedIn-CI: ', error);
                });
            }
            else {
                //console.log('CREATING USER');
                //console.log(profile);

                    
                UserService.hashId(profile.id)
                    .then(hashedId => {
                        const user = { 
                            user_name: profile.displayName,
                            user_id: hashedId,
                            user_thumbnail: profile.photos[0].value,
                            user_email: email,/*profile.email*/ //combo of thumbnail and name to make unique identifer 
                        }
                                    
                                    // // Add user to database
                        UserService.addUser(db, user).then(newUser => {                
                            //Call the callback function
                             done(null,newUser);
                        }).catch((error) => {
                            console.log('Error - ps-LinkedIn-AU: ', error);
                        });
                }).catch((error) => {
                    console.log('Error - ps-LinkedIn-HI: ', error);
                });
            }
        }).catch((error) => {
            console.log('Error - ps-LinkedIn-HUWE: ', error);
        });
        //if exists, retrieve info    
    })
)