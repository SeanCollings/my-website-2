import to from '../core/to';
import bcrypt from 'bcryptjs';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStategy = require('passport-local');

const User = mongoose.model('users');
const TempUser = mongoose.model('tempusers');
const keys = require('../config/keys');

// Create local strategy
const localOptions = { usernameField: 'emailAddress' };
const localLogin = new LocalStategy(localOptions, (email, password, done) => {
  TempUser.findOne({ emailAddress: email }, async (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false);

    return done(null, user);
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.secretJWT
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);

    if (user) {
      done(null, user);
    } else {
      const tempUser = await TempUser.findById(payload.sub);
      if (tempUser) done(null, tempUser);
      else done(null, false);
    }
  } catch (err) {
    done(err, false);
    throw err;
  }
});

passport.use(jwtLogin);
passport.use(localLogin);

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
      let err, existingUser, user;

      const { id, name, emails, photos } = profile;
      [err, existingUser] = await to(User.findOne({ googleId: id }));
      if (err) throw new Error(err);

      if (existingUser) {
        if (photos && existingUser.googlePhoto !== photos[0].value)
          [err] = await to(
            User.updateOne(
              { googleId: id },
              { $set: { googlePhoto: photos[0].value } }
            )
          );
        if (err) throw new Error(err);

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

      const emailAddress = emails ? emails[0].value.toLowerCase() : '';
      const alternateLoginUser = await User.findOne(
        {
          emailAddress,
          password: { $ne: null }
        },
        { _id: 1 }
      ).lean();

      if (alternateLoginUser) {
        await User.updateOne(
          { _id: alternateLoginUser._id },
          { $set: { googleId: id } }
        );

        [err, existingUser] = await to(
          User.findOne({ _id: alternateLoginUser._id })
        );

        if (err) throw new Error(err);

        return done(null, existingUser);
      }

      [err, user] = await to(
        new User({
          googleId: id,
          givenName: upperGivenName,
          familyName: upperFamilyName,
          emailAddress: emails ? emails[0].value.toLowerCase() : ''
        }).save()
      );
      if (err) throw new Error(err);

      done(null, user);
    }
  )
);
