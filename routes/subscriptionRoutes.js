// import requireLogin from '../middlewares/requireLogin';
import webPush from 'web-push';

const mongoose = require('mongoose');
const Subscription = mongoose.model('subscriptions');
const Users = mongoose.model('users');
const Groups = mongoose.model('notificationgroups');

export default app => {
  app.post('/api/update_subscriptions', async (req, res) => {
    try {
      const { newSub } = req.body;
      let userId = null;

      if (req.user) userId = req.user._id;

      if (newSub) {
        const keys = { auth: newSub.keys.auth, p256dh: newSub.keys.p256dh };
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

  app.post('/api/send_splash', async (req, res) => {
    try {
      const { givenName, familyName } = req.user;
      const { groupId } = req.body;

      const originator = `${givenName} ${familyName}`;
      const group = await Groups.findOne({ _id: groupId });

      const memberIds = [];
      if (group) {
        memberIds.push(group.createdById);
        group.members.map(member => {
          memberIds.push(member._id);
        });

        const subscriptions = await Subscription.find({
          _user: { $in: memberIds }
        });

        if (subscriptions.length > 0) {
          console.log('Subscriptions length:', subscriptions.length);

          subscriptions.forEach(sub => {
            const pushConfig = {
              endpoint: sub.endpoint,
              keys: {
                auth: sub.keys.auth,
                p256dh: sub.keys.p256dh
              }
            };

            const json = JSON.stringify({
              title: 'Splashed!',
              content: `${originator} is Splashing!`,
              openUrl: '/pereritto'
            });

            webPush.sendNotification(pushConfig, json);
          });
          return res.sendStatus(200);
        } else {
          console.log('No subscriptions found');
          return res.sendStatus(204);
        }
      }
    } catch (err) {
      throw err;
    }
  });
};
