const express = require('express');
const router = express.Router();
const  exphbs=require('express-handlebars');
const {ensureAuth}=require('../middleware/auth')
const Story=require('../models/Story')

// rout to show add page
//     GET/stories/add
router.get('/add', ensureAuth,(req, res) => {
    res.render('stories/add')
});

//desc   process and form
// route    POST/storeis
router.post('/', ensureAuth, async(req, res) => {
    try {
        req.body.user=req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
        
    } catch (err) {
        console.error(err);
        res.render('error/500');
        
    }
});


// show all stories
// GET/stories/add
router.get('/', ensureAuth,async(req, res) => {
   try {
       const stories=await Story.find({status: 'public'}).populate('user').sort({createdAt: 'desc'}).lean();
       res.render('stories/index',{
        stories,
       })
   } catch (err) {
       console.error(err);
       res.render('error/500');
   }
});
// description of dashboard

module.exports = router