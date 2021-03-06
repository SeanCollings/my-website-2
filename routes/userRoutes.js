import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';
import { MAINTENANCE_MENU } from '../client/src/utils/maintenance';
import to from '../core/to';

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
        let err, pererittoPlayer, isPererittoPlayer;
        let users = [];

        switch (req.query.param1) {
          case MAINTENANCE_MENU.ALL_USERS.type:
            [err, users] = await to(
              Users.find(
                {},
                {
                  uploadedPhoto: 0,
                  googlePhoto: 0,
                  googleId: 0
                }
              ).sort({ givenName: 1, familyName: 1 })
            );
            if (err) throw new Error(err);
            break;
          case MAINTENANCE_MENU.PERERITTO_USERS.type:
            [err, users] = await to(
              Users.find(
                { pererittoUser: true },
                { pererittoUser: 1, _pereritto: 1, givenName: 1, familyName: 1 }
              ).sort({
                givenName: 1
              })
            );
            if (err) throw new Error(err);

            if (users.length > 0) {
              const transformedUsers = [];

              switch (req.query.param2) {
                case MAINTENANCE_MENU.PERERITTO_USERS.options[0]:
                  for (let i = 0; i < users.length; i++) {
                    [err, pererittoPlayer] = await to(
                      PererittoUser.find(
                        {
                          _id: users[i]._pereritto
                        },
                        { _id: 1, retired: 1, retiredDate: 1 }
                      ).limit(1)
                    );
                    if (err) throw new Error(err);

                    if (pererittoPlayer.length > 0) {
                      const updatedUser = {
                        ...users[i]._doc,
                        retired: {
                          isRetired: pererittoPlayer[0].retired,
                          retiredDate: pererittoPlayer[0].retiredDate
                        }
                      };

                      transformedUsers.push(updatedUser);
                    }
                  }
                  return res.send(transformedUsers);
                case MAINTENANCE_MENU.PERERITTO_USERS.options[1]:
                  for (let i = 0; i < users.length; i++) {
                    [err, isPererittoPlayer] = await to(
                      PererittoUser.findOne(
                        {
                          _id: users[i]._pereritto
                        },
                        { _id: 1 }
                      ).limit(1)
                    );
                    if (err) throw new Error(err);

                    if (!isPererittoPlayer) transformedUsers.push(users[i]);
                  }

                  return res.send(transformedUsers);
              }
            }
            break;
          case 'User Groups':
            [err, users] = await to(
              Users.find(
                {},
                { givenName: 1, familyName: 1, uploadedPhoto: 1 }
              ).sort({
                givenName: 1,
                familyName: 1
              })
            );
            if (err) throw new Error(err);
            break;
          default:
            [err, users] = await to(
              Users.find().sort({ familyName: 1, givenName: 1 })
            );
            if (err) throw new Error(err);
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
      try {
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
      } catch (err) {
        throw err;
      }
    }
  );

  app.post('/api/upload_userphoto', requireLogin, async (req, res) => {
    try {
      const { dataUri } = req.body;
      const { _id } = req.user;

      await Users.updateOne({ _id }, { $set: { uploadedPhoto: dataUri } });

      /*const existingSettings = await Settings.findOne(
        {
          _user: req.user._id
        },
        { _id: 1 }
      ).limit(1);

      if (existingSettings) {
        await Settings.updateOne(
          { _id: existingSettings },
          { $set: { profilePic: 'uploadedPhoto' } }
        );
      }*/

      res.send({
        type: MessageTypeEnum.success,
        message: `Profile photo uploaded!`
      });
    } catch (err) {
      console.log(err);
      res.send({
        type: MessageTypeEnum.success,
        message: 'An error occured!'
      });
    }
  });

  app.delete('/api/delete_userphoto', requireLogin, async (req, res) => {
    try {
      const { _id } = req.user;

      await Users.updateOne({ _id }, { $unset: { uploadedPhoto: '' } });

      res.send({
        type: MessageTypeEnum.success,
        message: `Profile photo removed!`
      });
    } catch (err) {
      console.log(err);
      res.send({
        type: MessageTypeEnum.error,
        message: 'An error occured!'
      });
    }
  });
};
