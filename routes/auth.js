const express = require('express');
const router = express.Router();
const passport = require('passport')
// const exphbs = require('express-handlebars');

// desc Auth with google 
// route GET/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


// description of google auth callback
//route   Get/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: "/" }), (req, res) => {
    res.redirect('/dashboard')
}
);
// logout user
// route     /auth/logout
router.get('/logout', (req, res) => {
    req.logOut();//simply using request object created by passport js
    res.redirect('/');
})
module.exports = router