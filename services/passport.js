const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');

// Get users model out of mongoose
const User = mongoose.model('users');

// encode user id inside of the cookie..
passport.serializeUser((user, done) => {
  // 'user.id' -> id in DB
  // Can't always assume they'll have a google id
  done(null, user.id);
});

// Get user out of cookie
passport.deserializeUser((id, done) => {
  // Get User from DB by ID
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({
          googleId: profile.id,
          givenName: profile.name ? profile.name.givenName : '',
          familyName: profile.name ? profile.name.familyName : '',
          emailAddress: profile.emails ? profile.emails[0].value : ''
        }).save();
        done(null, user);
      } catch (error) {
        throw Error(error);
      }
    }
  )
);
