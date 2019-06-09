import passport from 'passport';

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
    req.logout();
    res.redirect('/home');
  });

  app.get('/api/current_user', async (req, res) => {
    try {
      // if (req.user) {
      //   await Users.updateOne(
      //     { _id: req.user._id }
      // { $set: { lastLogin: Date.now() } }
      //   );
      // }
      res.send(req.user);
    } catch (err) {
      throw err;
    }
  });

  app.get('/api/allow_notifications', async (req, res) => {
    try {
      if (req.user) {
        await Users.updateOne(
          { _id: req.user._id },
          { $set: { allowNotifications: true } }
        );
      }
      res.send(req.user);
    } catch (err) {
      throw err;
    }
  });
};
