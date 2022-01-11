var GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')


module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                // User.findOrCreate({ googleId: profile.id }, function (err, user) {
                //     return cb(err, user);
                // console.log(profile);
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value
                }//i m just storing the value in our schema and will check if presetn in our database then callback will be if not then it will create
                //then call back ...call back is compulsory otherwise after clicking on gmail it will hang out here done ()is call back
                try {
                    let user = await User.findOne({ googleId: profile.id })//its mongoose connect which use promises we are using await here
                    if (user) {
                        console.log(user);
                        done(null, user)//null represeting error if no error user
                    } else {
                        user = await User.create(newUser)
                        done(null, user)//call back
                    }
                } catch (err) {
                    console.error(err)
                }
            }

        ))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))


    })
}