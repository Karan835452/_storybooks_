const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars');
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

// rout for login
router.get('/', ensureGuest, (req, res) => {
    res.render('login', { layout: 'login' })
});

// description of dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({ user: req.user.id }).lean();//.lean is making the object plan that can be simply render to hbs template
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }

});

module.exports = router