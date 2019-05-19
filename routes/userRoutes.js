import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';
import { MAINTENANCE_MENU } from '../client/src/utils/maintenance';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const PererittoUser = mongoose.model('pererittos');

export default app => {
  app.get(
    '/api/get_users',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        let users = [];

        switch (req.query.param1) {
          case MAINTENANCE_MENU.ALL_USERS.type:
            users = await Users.find().sort({ familyName: 1, givenName: 1 });
            break;
          case MAINTENANCE_MENU.PERERITTO_USERS.type:
            users = await Users.find({ pererittoUser: true }).sort({
              givenName: 1
            });

            if (users.length > 0) {
              const transformedUsers = [];

              switch (req.query.param2) {
                case MAINTENANCE_MENU.PERERITTO_USERS.options[0]:
                  for (let i = 0; i < users.length; i++) {
                    const isPererittoPlayer = await PererittoUser.find(
                      {
                        _id: users[i]._pereritto
                      },
                      { _id: 1 }
                    ).limit(1);

                    if (isPererittoPlayer.length > 0)
                      transformedUsers.push(users[i]);
                  }

                  return res.send(transformedUsers);
                case MAINTENANCE_MENU.PERERITTO_USERS.options[1]:
                  for (let i = 0; i < users.length; i++) {
                    const isPererittoPlayer = await PererittoUser.findOne(
                      {
                        _id: users[i]._pereritto
                      },
                      { _id: 1 }
                    ).limit(1);
                    if (!isPererittoPlayer) transformedUsers.push(users[i]);
                  }

                  return res.send(transformedUsers);
              }
            }
            break;
          default:
            users = await Users.find().sort({ familyName: 1, givenName: 1 });
            break;
        }

        res.send(users);
      } catch (err) {
        console.log(err);
        return res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured in get users.'
        });
      }
    }
  );

  app.post(
    '/api/update_user',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      const { id, body } = req.body;

      if (!body.superUser && body.emailAddress === 'nightharrier@gmail.com')
        return res.send({
          type: MessageTypeEnum.error,
          message: "Whoops! That's not possible..."
        });

      try {
        const user = await Users.findOneAndUpdate(
          { _id: id },
          { $set: body },
          { useFindAndModify: false }
        );

        if (user._pereritto) {
          await PererittoUser.findOneAndUpdate(
            { _id: user._pereritto },
            { $set: { name: body.givenName } },
            { useFindAndModify: false }
          );
        }

        if (user) {
          return res.send({
            type: MessageTypeEnum.success,
            message: 'User successfully updated'
          });
        } else {
          return res.send({
            type: MessageTypeEnum.error,
            message: 'Something went wrong!'
          });
        }
      } catch (err) {
        console.log(err);
        return res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured in update user.'
        });
      }
    }
  );
};
