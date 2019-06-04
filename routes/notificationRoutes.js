import requireLogin from '../middlewares/requireLogin';
import webPush from 'web-push';

const mongoose = require('mongoose');
const Subscription = mongoose.model('subscriptions');
const Groups = mongoose.model('notificationgroups');
const Users = mongoose.model('users');

/* ADD REQUIRELOGIN BEFORE DEPLOY */

export default app => {
  app.get('/api/get_notificationgroups', async (req, res) => {
    try {
      const groups = await Groups.find();
      console.log('Groups', groups);
      return res.send(groups);
    } catch (err) {
      throw err;
    }
  });

  app.post('/api/add_notificationgroup', async (req, res) => {
    try {
      const { group } = req.body;
      const createdBy = `${req.user.givernName} ${req.user.familyName}`;
      const createdById = req.user._id;

      if (group) {
        await new Groups({
          name: group.name,
          image: group.image ? group.image : '',
          createdBy,
          createdById
        }).save();
      }

      const groups = await Groups.find();

      console.log(groups);
      return res.send(groups);
    } catch (err) {
      throw err;
    }
  });

  app.delete('/api/delete_notificationgroup', async (req, res) => {
    try {
      console.log('delete_notificationgroup');
    } catch (err) {
      throw err;
    }
  });

  app.post('/api/add_groupmember', async (req, res) => {
    try {
      console.log('add_groupmember');
    } catch (err) {
      throw err;
    }
  });

  app.delete('/api/remove_groupmember', async (req, res) => {
    try {
      console.log('remove_groupmember');
    } catch (err) {
      throw err;
    }
  });
};
