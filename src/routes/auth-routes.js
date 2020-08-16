const router = require('express').Router();
const passport = require('passport');

//custom middleware for authentication, this will redirect the user because the login process is handled from the server
const authCheckLogin = (req, res, next) => {
    console.log('checking authentication');

    if(!req.user){
        console.log('user dont exist');
        res.redirect(302, '/auth/loginpage');
    } 
    else{
        next();
    } 
};

//Same as above, but this will not redirect the user, but rather send a 'null' response
const authCheck = (req, res, next) => {
    console.log('checking authentication');
    // console.log(req);
    console.log('break 1#');
    console.log('checking authentication 8/9 123');
    // console.log(res);
    console.log('break 2#');
    // console.log(req.user);

    if(!req.user){
        console.log('user don\'t exist');
        res.send({});
    } 
    else{
        next();
    } 
};

//Endpoint: Called for authorization, middleware: authCheck is called, user data sent to client
router.get('/', authCheck, (req, res,next) => {
    console.log("auth//// /");
    console.log(JSON.stringify(req.user));
    //let response = { mail: { message: 'got it' }}

    res.send(req.user);
  });

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    res.send(JSON.stringify('logging out'));
});

router.get('/loginpage', (req, res) => {
    console.log('in movint to login page');
    //only way I found to rewrite the url and redirect it from the servers url to the clients url
    res.writeHead(301, {Location: 'http://localhost:3000/login'});
    res.end();
})


// router.get('/login', (req, res, next) => {
//     // handle with passport
//     res.send(JSON.stringify('logging out'));
// });

// redirect to login url (auth/google)
router.get('/login/google', (req, res, next) => {
   // console.log('redirecting to auth/google');
   // res.status(200);
   // res.send(JSON.stringify('googleLogin'));
    res.redirect(302, '/auth/logout');
    //  res.redirect(302,'/home');
    //   res.sendStatus(302);
    //  return res.redirect(302, '/home');
});

// auth login with google
router.get('/google', passport.authenticate('google', {
    //this tells us what info we want from the user
    scope: ['profile', 'email']
}));


//callback route for google to redirect to
router.get('/rggl/redirect', passport.authenticate('google'), (req,res) => {
   // console.log('error or nah?');
  //  console.log('made it to send', req.user);
    // res.status(200).send('you reached the callback URI');
    // res.send(req.user);
    res.redirect(302, '/auth/profile');
});

//before the middleware is ran, the cookie will be deserialized.
//until the database is setup, we'll only have access to the id
router.get('/profile', authCheckLogin, (req,res) => {
    console.log('passed auth');
    console.log('in profile: ', req.user);
     //only way I found to rewrite the url and redirect it from the servers url to the clients url
     res.writeHead(301, {Location: 'http://localhost:3000/'});
     res.send();
    // if(req.user.user_id === false) res.send('Unauthorized User!');
    // else res.send('You are logged in as - ' + req.user.user_email);
});




module.exports = router;