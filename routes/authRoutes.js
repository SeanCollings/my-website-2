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

      if (req.user) {
        const user = await Users.findOne(
          { _id: req.user._id },
          { splashes: 1, lastSplashed: 1 }
        );

        const today = new Date();
        const isToday =
          user.lastSplashed.getDate() === today.getDate() &&
          user.lastSplashed.getMonth() === today.getMonth() &&
          user.lastSplashed.getFullYear() === today.getFullYear();

        if (!isToday && user.splashes < 5)
          await Users.updateOne(
            { _id: req.user._id },
            { $set: { splashes: 5 } }
          );
      }
      res.send(req.user);
    } catch (err) {
      throw err;
    }
  });
};
