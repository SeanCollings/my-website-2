import requireLogin from '../middlewares/requireLogin';
import webPush from 'web-push';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const Subscription = mongoose.model('subscriptions');
const Groups = mongoose.model('notificationgroups');
const Users = mongoose.model('users');

/* ADD REQUIRELOGIN BEFORE DEPLOY */

export default app => {
  app.get('/api/get_notificationgroups', async (req, res) => {
    try {
      const { _id } = req.user;
      const groups = await Groups.find().sort([['_id', -1]]);

      const usersGroups = [];
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].createdById.toString() === _id.toString()) {
          usersGroups.push(groups[i]);
          continue;
        }

        for (let j = 0; j < groups[i].members.length; j++) {
          if (groups[i].members[j]._user.toString() === _id.toString()) {
            usersGroups.push(groups[i]);
            continue;
          }
        }
      }

      console.log('Total groups found:', usersGroups.length);
      return res.send(usersGroups);
    } catch (err) {
      throw err;
    }
  });

  app.post('/api/add_notificationgroup', requireLogin, async (req, res) => {
    try {
      const { name, icon, groupMembers } = req.body;
      const createdBy = `${req.user.givenName} ${req.user.familyName}`;
      const createdById = req.user._id;

      const group = await new Groups({
        name,
        icon,
        createdBy,
        createdById,
        createdDate: new Date()
      }).save();

      const membersArray = [];
      groupMembers.forEach(member => {
        membersArray.push({ _user: member });
      });

      await Groups.updateOne(group, {
        $push: { members: { $each: membersArray } }
      });

      res.send({
        type: MessageTypeEnum.success,
        message: `${name} created successfully!`
      });
    } catch (err) {
      res.send({
        type: MessageTypeEnum.error,
        message: `Something went wrong in add_notificationgroup`
      });
      throw err;
    }
  });

  app.post('/api/update_notificationgroup', requireLogin, async (req, res) => {
    try {
      const { _id, name, icon, groupMembers, createdById } = req.body;

      if (req.user._id.toString() === createdById) {
        await Groups.updateOne(
          { _id },
          { $unset: { members: '' }, $set: { name, icon } }
        );

        const membersArray = [];
        groupMembers.forEach(member => {
          membersArray.push({ _user: member });
        });

        await Groups.updateOne(
          { _id },
          {
            $push: { members: { $each: membersArray } }
          }
        );

        return res.send({
          type: MessageTypeEnum.success,
          message: `${name} updated successfully!`
        });
      } else {
        res.send({
          type: MessageTypeEnum.error,
          message: "You don't have rights to update this group!"
        });
      }
    } catch (err) {
      res.send({
        type: MessageTypeEnum.error,
        message: `Something went wrong in update_notificationgroup`
      });
      throw err;
    }
  });

  app.post('/api/add_nsu_notificationgroup', requireLogin, async (req, res) => {
    try {
      const { name, icon, groupMembers } = req.body;
      const createdBy = `${req.user.givenName} ${req.user.familyName}`;
      const createdById = req.user._id;

      const group = await new Groups({
        name,
        icon,
        createdBy,
        createdById,
        createdDate: new Date()
        // members: user ? [{ _user: user['_id'] }] : []
      }).save();

      const users = await Users.find(
        { emailAddress: { $in: groupMembers } },
        { _id: 1 }
      );

      const membersArray = [];
      users.forEach(member => {
        membersArray.push({ _user: member['_id'] });
      });

      await Groups.updateOne(group, {
        $push: { members: { $each: membersArray } }
      });

      res.send({
        type: MessageTypeEnum.success,
        message: `${name} created successfully!`
      });
    } catch (err) {
      res.send({
        type: MessageTypeEnum.error,
        message: `Something went wrong in add_nsu_notificationgroup`
      });
      throw err;
    }
  });

  app.post(
    '/api/update_nsu_notificationgroup',
    requireLogin,
    async (req, res) => {
      try {
        const { _id, name, icon, createdById } = req.body;

        if (req.user._id.toString() === createdById) {
          await Groups.updateOne({ _id }, { $set: { name, icon } });

          return res.send({
            type: MessageTypeEnum.success,
            message: `${name} updated successfully!`
          });
        } else {
          res.send({
            type: MessageTypeEnum.error,
            message: "You don't have rights to update this group!"
          });
        }
      } catch (err) {
        res.send({
          type: MessageTypeEnum.error,
          message: `Something went wrong in update_notificationgroup`
        });
        throw err;
      }
    }
  );

  app.delete(
    '/api/delete_notificationgroup',
    requireLogin,
    async (req, res) => {
      try {
        const { _id } = req.user;
        const { createdById, groupId, name } = req.body;

        if (_id.toString() === createdById) {
          await Groups.deleteOne({ _id: groupId });
          return res.send({
            type: MessageTypeEnum.success,
            message: `${name} deleted!`
          });
        } else {
          return res.send({
            type: MessageTypeEnum.error,
            message: "You don't have rights to delete this group!"
          });
        }
      } catch (err) {
        res.send({
          type: MessageTypeEnum.error,
          message: `Something went wrong in delete_notificationgroup`
        });
        throw err;
      }
    }
  );

  app.get('/api/get_groupmembers', requireLogin, async (req, res) => {
    try {
      const { groupid } = req.query;
      const group = await Groups.findOne({ _id: groupid });

      const membersArray = [];
      if (group) {
        membersArray.push(group.createdById);
        group.members.forEach(member => {
          membersArray.push(member._user);
        });

        const users = await Users.find(
          { _id: { $in: membersArray } },
          {
            givenName: 1,
            familyName: 1,
            uploadedPhoto: 1,
            allowNotifications: 1
          }
        ).sort({ givenName: 1 });

        console.log('Found members:', users.length);
        return res.send(users);
      }

      // console.log(membersArray);
      return res.sendStatus(204);
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
