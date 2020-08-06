const router = require('express').Router();
const passport = require('passport');

//custom middleware for authentication
const authCheck = (req, res, next) => {
    console.log('checking authentication');

    if(!req.user){
        console.log('user dont exist');
        res.redirect(302, '/auth/loginpage');
    } 
    else{
        next();
    } 
};

router.get('/', (req, res,next) => {
    console.log("auth//// /");
    let response = { mail: { message: 'got it' }}
  
    res.send(JSON.stringify('IN AUTH!!!'))
  });

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    res.send(JSON.stringify('logging out'));
});

router.get('/loginpage', (req, res) => {
    console.log('in movint to login page');
    res.writeHead(301, {Location: 'http://localhost:3000/login'});
    res.end();
})


// router.get('/login', (req, res, next) => {
//     // handle with passport
//     res.send(JSON.stringify('logging out'));
// });

// redirect to login url (auth/google)
router.get('/login/google', (req, res, next) => {
   // res.header("Access-Control-Allow-Origin", "*");
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
router.get('/profile', authCheck, (req,res) => {
    console.log('passed auth');
    console.log('in profile: ', req.user);
    if(req.user.user_id === false) res.send('Unauthorized User!');
    else res.send('You are logged in as - ' + req.user.user_email);
});




module.exports = router;