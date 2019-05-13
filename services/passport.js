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
        const { id, name, emails } = profile;
        const existingUser = await User.findOne({ googleId: id });

        if (existingUser) {
          return done(null, existingUser);
        }

        let upperGivenName = '';
        let upperFamilyName = '';

        if (name) {
          upperGivenName = name.givenName
            ? name.givenName.replace(/^\w/, c => c.toUpperCase())
            : '';
          upperFamilyName = name.familyName
            ? name.familyName.replace(/^\w/, c => c.toUpperCase())
            : '';
        }

        const user = await new User({
          googleId: id,
          givenName: upperGivenName,
          familyName: upperFamilyName,
          emailAddress: emails ? emails[0].value : ''
        }).save();
        done(null, user);
      } catch (error) {
        throw Error(error);
      }
    }
  )
);
