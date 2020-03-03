import requireLogin from '../middlewares/requireLogin';
import webPush from 'web-push';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const Subscription = mongoose.model('subscriptions');
const Users = mongoose.model('users');
const Groups = mongoose.model('notificationgroups');

export default app => {
  app.post('/api/update_subscriptions', requireLogin, async (req, res) => {
    try {
      const { newSub } = req.body;

      if (newSub) {
        const keys = { auth: newSub.keys.auth, p256dh: newSub.keys.p256dh };
        await new Subscription({
          endpoint: newSub.endpoint,
          keys,
          _user: req.user._id
        }).save();

        return res.sendStatus(200);
      }
      return res.sendStatus(204);
    } catch (err) {
      throw err;
    }
  });

  app.get('/api/get_splashes', requireLogin, async (req, res) => {
    try {
      const { _id } = req.user;

      const splashes = await Users.findOne({ _id }, { splashes: 1 });
      res.send(splashes);
    } catch (err) {
      throw err;
    }
  });

  app.post('/api/send_splash', requireLogin, async (req, res) => {
    try {
      const { _id, givenName, familyName, splashes } = req.user;
      const { groupId } = req.body;

      const originator = `${givenName} ${familyName}`;

      if (splashes > 0) {
        console.log('Splashes left:', splashes);
        const group = await Groups.findOne({ _id: groupId });

        const memberIds = [];
        if (group) {
          memberIds.push(group.createdById);
          group.members.map(member => {
            memberIds.push(member._user);
          });

          const subscriptions = await Subscription.find({
            _user: { $in: memberIds }
          });

          if (subscriptions.length > 0) {
            console.log('Subscriptions length:', subscriptions.length);

            subscriptions.forEach(sub => {
              try {
                const pushConfig = {
                  endpoint: sub.endpoint,
                  keys: {
                    auth: sub.keys.auth,
                    p256dh: sub.keys.p256dh
                  }
                };

                const json = JSON.stringify({
                  title: `${givenName} Splashed!`,
                  content: `${originator} is Splashing from ${group.name}!`,
                  openUrl: '/notifications'
                });

                webPush.sendNotification(pushConfig, json);
              } catch (err) {
                console.log('Web Push Error:', err);
              }
            });

            await Users.updateOne(
              { _id },
              { $set: { splashes: splashes - 1, lastSplashed: new Date() } }
            );

            return res.send({ splashes: splashes - 1 });
          } else {
            console.log('No subscriptions found');
            return res.sendStatus(204);
          }
        }
      }
    } catch (err) {
      throw err;
    }
  });

  app.get('/api/allow_notifications', requireLogin, async (req, res) => {
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

  app.post('/api/disable_notifications', requireLogin, async (req, res) => {
    try {
      const { _id } = req.user;
      const { showConfirmationMessage } = req.body;

      await Users.updateOne({ _id }, { $set: { allowNotifications: false } });

      await Subscription.deleteMany({ _user: _id });

      if (showConfirmationMessage) {
        res.send({
          type: MessageTypeEnum.success,
          message: "You've successfully disabled notifications!"
        });
      } else {
        res.send({
          type: MessageTypeEnum.none,
          message: ''
        });
      }
    } catch (err) {
      res.send({
        type: MessageTypeEnum.error,
        message: 'Something went wrong in disable_notifications'
      });
      throw err;
    }
  });
};
