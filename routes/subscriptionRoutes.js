// import requireLogin from '../middlewares/requireLogin';
import webPush from 'web-push';

const mongoose = require('mongoose');
const Subscription = mongoose.model('subscriptions');
const Users = mongoose.model('users');

export default app => {
  app.post('/api/update_subscriptions', async (req, res) => {
    try {
      console.log('req.user', req.user);
      let userId = null;
      if (req.user) {
        userId = req.user._id;
      }

      const { newSub } = req.body;
      // console.log(newSub);

      if (newSub) {
        const keys = { auth: newSub.keys.auth, p256dh: newSub.keys.p256dh };
        console.log(keys);
        await new Subscription({
          endpoint: newSub.endpoint,
          keys,
          _user: userId ? userId : '5cce28ef8f0e6c0b48bda9b3'
        }).save();

        return res.sendStatus(200);
      }
      return res.sendStatus(204);
    } catch (err) {
      throw err;
    }
  });

  app.post('/api/test_notification', async (req, res) => {
    try {
      const subscriptions = await Subscription.find();

      if (subscriptions.length > 0) {
        subscriptions.forEach(sub => {
          const pushConfig = {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.keys.auth,
              p256dh: sub.keys.p256dh
            }
          };
          webPush.sendNotification(
            pushConfig,
            JSON.stringify({ title: 'Splashed', content: 'Splashing now!' })
          );
        });

        return res.sendStatus(200);
      } else {
        console.log('No subscriptions found');
        return res.sendStatus(204);
      }
    } catch (err) {
      throw err;
    }
  });
};
