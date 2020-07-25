const router = require('express').Router();
const passport = require('passport');


// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
})

// redirect to login url (auth/google)
router.get('/google/login', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log('redirecting to auth/google');
    // res.status(200);
    res.redirect(301, 'http://localhost:3000/chat');
})

// auth login with google
router.get('/google', passport.authenticate('google', {
    //this tells us what info we want from the user
    scope: ['profile']
}));


//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
    console.log('made it to send');
    // res.status(200).send('you reached the callback URI');
    res.redirect('/profile/');
});




module.exports = router;