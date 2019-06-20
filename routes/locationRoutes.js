import requireLogin from '../middlewares/requireLogin';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const LocationGroups = mongoose.model('locationgroups');
const Users = mongoose.model('users');

const getMembersEmails = async members => {
  const memberIds = [];
  members.forEach(member => {
    memberIds.push(member._user);
  });

  const userEmails = await Users.find(
    { _id: { $in: memberIds } },
    { emailAddress: 1 }
  );

  return userEmails;
};

export default app => {
  app.get('/api/get_locationgroups', requireLogin, async (req, res) => {
    try {
      const { _id, superUser } = req.user;
      const locationGroups = await LocationGroups.find().sort([['_id', -1]]);

      const usersGroups = [];
      for (let i = 0; i < locationGroups.length; i++) {
        if (locationGroups[i].createdById.toString() === _id.toString()) {
          if (superUser) {
            usersGroups.push(locationGroups[i]);
            continue;
          } else {
            const memberEmails = await getMembersEmails(
              locationGroups[i].members
            );

            usersGroups.push({
              ...locationGroups[i]._doc,
              members: memberEmails
            });
            continue;
          }
        }

        for (let j = 0; j < locationGroups[i].members.length; j++) {
          if (
            locationGroups[i].members[j]._user.toString() === _id.toString()
          ) {
            usersGroups.push(locationGroups[i]);
            continue;
          }
        }
      }

      console.log('Total location groups found:', usersGroups.length);
      return res.send(usersGroups);
    } catch (err) {
      throw err;
    }
  });

  app.post('/api/add_locationgroup', requireLogin, async (req, res) => {
    try {
      const { name, icon, location, groupMembers } = req.body;
      const createdBy = `${req.user.givenName} ${req.user.familyName}`;
      const createdById = req.user._id;

      const group = await new LocationGroups({
        name,
        icon,
        location,
        createdBy,
        createdById,
        createdDate: new Date()
      }).save();

      const superUser = await Users.findOne(
        { _id: createdById },
        { superUser: 1 }
      );

      const membersArray = [];
      if (groupMembers) {
        if (superUser.superUser) {
          groupMembers.forEach(member => {
            membersArray.push({ _user: member });
          });
        } else {
          const users = await Users.find(
            { emailAddress: { $in: groupMembers } },
            { _id: 1 }
          );

          users.forEach(member => {
            if (member) membersArray.push({ _user: member['_id'] });
          });
        }

        await LocationGroups.updateOne(group, {
          $push: { members: { $each: membersArray } }
        });
      }

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

  app.post('/api/update_locationgroup', requireLogin, async (req, res) => {
    try {
      const { superUser } = req.user;
      const { _id, name, icon, location, groupMembers } = req.body;

      await LocationGroups.updateOne(
        { _id },
        { $unset: { members: '' }, $set: { name, icon, location } }
      );

      const membersArray = [];
      if (groupMembers) {
        if (superUser) {
          groupMembers.forEach(member => {
            membersArray.push({ _user: member });
          });
        } else {
          const users = await Users.find(
            { emailAddress: { $in: groupMembers } },
            { _id: 1 }
          );

          users.forEach(member => {
            if (member) membersArray.push({ _user: member['_id'] });
          });
        }

        await LocationGroups.updateOne(
          { _id },
          {
            $push: { members: { $each: membersArray } }
          }
        );
      }

      return res.send({
        type: MessageTypeEnum.success,
        message: `${name} updated successfully!`
      });
    } catch (err) {
      res.send({
        type: MessageTypeEnum.error,
        message: `Something went wrong in update_notificationgroup`
      });
      throw err;
    }
  });

  app.delete('/api/delete_locationgroup', requireLogin, async (req, res) => {
    try {
      const { _id, name } = req.body;

      await LocationGroups.deleteOne({ _id });
      return res.send({
        type: MessageTypeEnum.success,
        message: `${name} deleted!`
      });
    } catch (err) {
      res.send({
        type: MessageTypeEnum.error,
        message: `Something went wrong in delete_locationgroup`
      });
      throw err;
    }
  });
};
