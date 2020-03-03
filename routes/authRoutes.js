import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';

import keys from '../config/keys';
import sendEmail from '../core/sendEmail';
import {
  MessageTypeEnum,
  MIN_PASSWORD_LENGTH,
  MAX_NAMES_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  VERIFY_EMAIL_MESSAGE
} from '../client/src/utils/constants';
import blockedEmails from '../core/blockedEmails';
import { getLastReleaseCreatedDate } from './appRoutes';
import to from '../core/to';
import {
  htmlUserAlreadyVerified,
  htmlNoUser,
  htmlUserVerified
} from '../core/emailTemplates';
import { extractUserDetails } from '../core/utils/utility';
import checkAuthorization from '../middlewares/checkAuthorization';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const TempUsers = mongoose.model('tempusers');

const validateEmail = email => {
  const regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

const validateName = name => {
  const regex = /^[a-z ,.'-]+$/i;
  return regex.test(String(name).toLowerCase());
};

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, keys.secretJWT);
};

export default app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/home');
    }
  );

  app.post('/api/signup', async (req, res) => {
    try {
      const { givenName, familyName, emailAddress, password } = req.body;

      if (
        !givenName ||
        !familyName ||
        !emailAddress ||
        !password ||
        password.length < MIN_PASSWORD_LENGTH ||
        givenName.length > MAX_NAMES_LENGTH ||
        familyName.length > MAX_NAMES_LENGTH ||
        emailAddress.length > MAX_EMAIL_LENGTH ||
        password.length > MAX_PASSWORD_LENGTH ||
        !validateEmail(emailAddress) ||
        !validateName(givenName) ||
        !validateName(familyName)
      ) {
        return res.send({
          message: {
            type: MessageTypeEnum.error,
            message: `Error: 422`
          }
        });
      }

      const domainName = emailAddress.split('@')[1].toLowerCase();

      if (domainName && blockedEmails.includes(domainName)) {
        return res.send({
          message: {
            type: MessageTypeEnum.error,
            message: `An error occurred: 1`
          }
        });
      }

      const user = await Users.findOne(
        { emailAddress: emailAddress.toLowerCase() },
        { _id: 1, googleId: 1, password: 1 }
      ).lean();
      const tempUser = await TempUsers.findOne(
        { emailAddress: emailAddress.toLowerCase() },
        { _id: 1 }
      ).lean();

      let googleUser = false;
      if ((user && !user.googleId) || (user && !!user.password) || tempUser) {
        return res.send({
          message: {
            type: MessageTypeEnum.error,
            message: `Email already exists!`
          }
        });
      } else if (user && user.googleId) {
        googleUser = true;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationString = Math.random();

      const newUser = await new TempUsers({
        givenName,
        familyName,
        emailAddress: emailAddress.toLowerCase(),
        password: hashedPassword,
        verificationString,
        googleUser
      }).save();

      if (newUser) {
        sendEmail(emailAddress, givenName, verificationString);
      } else {
        return res.send({
          message: {
            type: MessageTypeEnum.error,
            message: `An error occurred: 2`
          }
        });
      }

      return res.send({
        message: {
          type: MessageTypeEnum.warning,
          message: VERIFY_EMAIL_MESSAGE
        },
        user: extractUserDetails(newUser),
        token: tokenForUser(newUser)
      });
    } catch (err) {
      res.send({
        message: {
          type: MessageTypeEnum.error,
          message: `Something went wrong`
        }
      });
      throw err;
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { emailAddress, password } = req.body;
      let foundUser;

      if (
        !emailAddress ||
        !password ||
        emailAddress.length > MAX_EMAIL_LENGTH ||
        password.length > MAX_PASSWORD_LENGTH
      ) {
        return res.send({
          message: {
            type: MessageTypeEnum.error,
            message: `Error: 422`
          }
        });
      }

      const user = await Users.findOne({
        emailAddress: emailAddress.toLowerCase()
      }).lean();

      if (user && !!user.password) {
        foundUser = { ...user };
      } else {
        const tempUser = await TempUsers.findOne({
          emailAddress: emailAddress.toLowerCase()
        }).lean();

        if (tempUser) foundUser = { ...tempUser };
        else {
          return res.send({
            message: {
              type: MessageTypeEnum.error,
              message: `Incorrect email or password`
            }
          });
        }
      }

      const result = await bcrypt.compare(password, foundUser.password);

      if (result) {
        const message =
          user && !!user.password
            ? {
                type: MessageTypeEnum.none,
                message: ''
              }
            : {
                type: MessageTypeEnum.warning,
                message: VERIFY_EMAIL_MESSAGE
              };

        return res.send({
          message,
          user: extractUserDetails(foundUser),
          token: tokenForUser(foundUser)
        });
      } else {
        return res.send({
          message: {
            type: MessageTypeEnum.error,
            message: `Incorrect email or password`
          }
        });
      }
    } catch (err) {
      res.send({
        message: {
          type: MessageTypeEnum.error,
          message: `Something went wrong`
        }
      });
      throw err;
    }
  });

  app.get('/api/logout', (req, res) => {
    try {
      req.logout();
      res.redirect('/home');
    } catch (err) {
      throw err;
    }
  });

  app.get('/api/current_user', checkAuthorization, async (req, res) => {
    let err, user;
    // if (req.user) {
    //   await Users.updateOne(
    //     { _id: req.user._id }
    // { $set: { lastLogin: Date.now() } }
    //   );
    // }

    if (req.user && !req.user.tempUser) {
      [err, user] = await to(
        Users.findOne({ _id: req.user._id }, { splashes: 1, lastSplashed: 1 })
      );
      if (err) throw new Error(err);

      const userLastLoggedIn = new Date(req.user.lastLogin);
      if (userLastLoggedIn > getLastReleaseCreatedDate()) {
        [err] = await to(
          Users.updateOne(
            { _id: req.user._id },
            { $set: { lastLogin: Date.now() } }
          )
        );
        if (err) throw new Error(err);
      }

      const today = new Date();
      const isToday =
        user.lastSplashed.getDate() === today.getDate() &&
        user.lastSplashed.getMonth() === today.getMonth() &&
        user.lastSplashed.getFullYear() === today.getFullYear();

      if (!isToday && user.splashes < 5) {
        [err] = await to(
          Users.updateOne({ _id: req.user._id }, { $set: { splashes: 5 } })
        );
        if (err) throw new Error(err);
      }
    }

    return res.send(extractUserDetails(req.user));
  });

  app.get('/api/verify', async (req, res) => {
    try {
      const { email: emailAddress, id } = req.query;
      let verifiedUser;

      if (!emailAddress || !id) {
        return res.send();
      }

      const tempUser = await TempUsers.findOne({
        emailAddress: emailAddress.toLowerCase(),
        verificationString: id
      }).lean();

      if (tempUser) {
        if (!!tempUser.googleUser) {
          verifiedUser = await Users.findOneAndUpdate(
            { emailAddress: emailAddress.toLowerCase() },
            { $set: { password: tempUser.password } },
            { useFindAndModify: false }
          ).lean();
        } else {
          const { givenName, familyName, emailAddress, password } = tempUser;

          verifiedUser = await new Users({
            givenName,
            familyName,
            emailAddress,
            password
          }).save();
        }

        await TempUsers.deleteOne({
          emailAddress: emailAddress.toLowerCase(),
          verificationString: id
        });
      } else {
        const user = await Users.findOne(
          {
            emailAddress,
            password: { $ne: null }
          },
          { _id: 1 }
        );

        if (user) return res.send(htmlUserAlreadyVerified);
        else return res.send(htmlNoUser);
      }

      // if (process.env.NODE_ENV === 'production')
      //   return res.redirect('https://seancollings.herokuapp.com/home');
      // else return res.redirect('http://localhost:3000/home');
      return res.send(htmlUserVerified(tokenForUser(verifiedUser)));
    } catch (err) {
      throw err;
    }
  });
};
