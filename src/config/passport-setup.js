const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');


passport.serializeUser( (user, done) => {
    done(null, user.id);//id in the database
})

passport.deserializeUser( (user, done) => {
    //find the user id in the database
    done(null, user);
})

passport.use(
    new GoogleStrategy({
        //options for the google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //passport call back function
        console.log('in passport setup',profile);
        //check if user exists in database

        //if exists, retrieve info

        //save to database
        console.log(profile.displayName, profile.id);
        // .then()
        const currentUser = { username: profile.displayName,
                                googleId: profile.id
                            }
        done(null, currentUser);
    })
)