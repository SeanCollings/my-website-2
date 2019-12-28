import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const PereryvUsers = mongoose.model('pereryvs');
const Slates = mongoose.model('slates');

export default app => {
  app.get('/api/get_slates', requireLogin, async (req, res) => {
    try {
      const slates = await Slates.find().sort({
        createdDate: 1
      });
      res.send(slates);
    } catch (err) {
      console.log(err);
      res.send(503);
    }
  });

  app.get('/api/get_completed_slates', requireLogin, async (req, res) => {
    try {
      const slates = await Slates.find({ completed: true }, { _id: 1 });
      res.send({ count: slates.length });
    } catch (err) {
      console.log(err);
      res.send(503);
    }
  });

  app.get('/api/get_pereryv_users', requireLogin, async (req, res) => {
    try {
      const users = await PereryvUsers.find().sort({ position: 1 });
      res.send(users);
    } catch (err) {
      console.log(err);
    }
  });

  app.post(
    '/api/create_slate',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { slateName } = req.body;

        const users = await PereryvUsers.find({ active: true }).sort({
          position: 1
        });

        if (users.length) {
          await new Slates({
            name: slateName,
            members: users,
            createdDate: new Date()
          }).save();
        } else {
          /* TODO: remove after going to prod once! */
          const newUsers = [
            {
              name: 'Matthew',
              color: '#0074d9',
              position: 0,
              paid: false
            },
            {
              name: 'Vaughn',
              color: '#b10dc9',
              position: 1,
              paid: false
            },
            {
              name: 'Trevor',
              color: '#ff4136',
              position: 2,
              paid: false
            },
            {
              name: 'Jarrod',
              color: '#ff851b',
              position: 3,
              paid: false
            },
            {
              name: 'Sean',
              color: '#2ecc40',
              position: 4,
              paid: false
            }
          ];

          await newUsers.forEach(async user => {
            await new PereryvUsers({
              name: user.name,
              color: user.color,
              position: user.position,
              paid: user.paid
            }).save();
          });

          return res.send({
            type: MessageTypeEnum.success,
            message: `Users added for the first time!`
          });
        }
        console.log('New slate ready:', slateName);

        res.send({
          type: MessageTypeEnum.success,
          message: `${slateName} created!`
        });
      } catch (err) {
        console.log(err);
        res.send({
          type: MessageTypeEnum.success,
          message: 'An error occured!'
        });
      }
    }
  );

  app.post(
    '/api/update_slate',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { slateId, slateName, userIds } = req.body;
        const slate = await Slates.findOne({ _id: slateId });

        if (slate) {
          const updatedMembers = slate.members.map(member => {
            if (userIds.includes(member._id.toString())) {
              return { ...member, paid: true };
            }
            return member;
          });

          const isSlateComplete =
            updatedMembers.filter(member => member.paid).length ===
            slate.members.length;

          await Slates.updateOne(
            { _id: slateId },
            { $set: { members: updatedMembers, completed: isSlateComplete } }
          );

          return res.send({
            type: MessageTypeEnum.success,
            message: `${slateName} Updated!`
          });
        }

        res.send({
          type: MessageTypeEnum.success,
          message: 'That slate does not exist!'
        });
      } catch (err) {
        console.log(err);
        res.send({
          type: MessageTypeEnum.success,
          message: 'An error occured!'
        });
      }
    }
  );
};
