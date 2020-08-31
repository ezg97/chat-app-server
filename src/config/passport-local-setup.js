// //console.log('in local setup');

// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');



// require('dotenv').config();

// const passport = require('passport');
// const keys = require('./keys');
// const UserService = require('./passport-setup-service');
// const knex = require('knex');
// const { DATABASE_URL } = require('../config');

// const db = knex({
//     client: 'pg',
//     connection: DATABASE_URL,
//   });

// //Serialize the user id
// passport.serializeUser( (user, done) => {
//     //console.log('LOCAL: in serialize');
//     done(null, user.user_email);//id in the database
// });

// passport.deserializeUser( (email, done) => {
//     //find the user id in the database
//     //console.log('LOCAL: in DEserialize **');
//     //console.log('LOCAL: email: ', email);
//     //Locating the user in the database
//     UserService.hasUserWithEmail(
//         db,
//         email,
//     )
//     .then(userInfo => {
//         //console.log('LOCAL: returned from service: ', userInfo);
//         //If the user exists then pass into the callback function, else, pass in empty object
//         if(userInfo) done(null, userInfo);
//         else done(null,{});
//     })
//     .catch (err => {
//         console.error('LOCAL: ERROR THROWN trying to access database: ', err);
//     });
// });

// /*newAccount=false, displayName="",*/
// passport.use(
//     new LocalStrategy({
//         usernameField: 'email', 
//         passwordField: 'password'
//     }), 
//     (username, password, done) => {
//         //console.log('LOCAL STRATEGY');
//         //check if user exists in database
//         UserService.hasUserWithEmail(db, email)
//         .then(currentUser => {
//             //If the user is in the database then pass them into the callback function
//             if (currentUser) {
//                 //console.log('USING USER');
//                 if(await bcrypt.compare(password, currentUser.password)) {
//                     //user is authenticated
//                     done(null, currentUser);
//                 }
//                 else {
//                     return done(null, false, {message: 'Password Incorrect'});
//                 }
//             }
//             if(newAccount) {
//                 //console.log('LOCAL: CREATING USER');
//                 //Initialize the user object with the profile and email info
//                 const user = { 
//                     user_name: displayName,
//                     // user_thumbnail: profile._json.picture,
//                     user_email: email,
//                     user_password: password
//                 }
                
//                 // Add user to database
//                 UserService.addUser(db, user).then(newUser => {
//                     //console.log('LOCAL: New User Created:' + newUser);
//                     //Call the callback function
//                     done(null,newUser);
//                 });
//             }
     
//             //maybe done(null,{});
//         });
// });
    