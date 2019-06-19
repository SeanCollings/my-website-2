import requireLogin from '../middlewares/requireLogin';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const LocationGroups = mongoose.model('locationgroups');
const Users = mongoose.model('users');

export default app => {
  app.get('/api/get_locationgroups', requireLogin, async (req, res) => {
    try {
      const { _id } = req.user;
      const locationGroups = await LocationGroups.find().sort([['_id', -1]]);

      const usersGroups = [];
      for (let i = 0; i < locationGroups.length; i++) {
        if (locationGroups[i].createdById.toString() === _id.toString()) {
          usersGroups.push(locationGroups[i]);
          continue;
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
};
