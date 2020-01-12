import passport from 'passport';
import { getLastReleaseCreatedDate } from './appRoutes';
import to from '../core/to';

const mongoose = require('mongoose');
const Users = mongoose.model('users');

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

  app.get('/api/logout', (req, res) => {
    try {
      req.logout();
      res.redirect('/home');
    } catch (err) {
      throw err;
    }
  });

  app.get('/api/current_user', async (req, res) => {
    let err, user;
    // if (req.user) {
    //   await Users.updateOne(
    //     { _id: req.user._id }
    // { $set: { lastLogin: Date.now() } }
    //   );
    // }

    if (req.user) {
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
    res.send(req.user);
  });
};
