import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';
import { brotliCompressSync } from 'zlib';

const mongoose = require('mongoose');
const Users = mongoose.model('users');

export default app => {
  app.get(
    '/api/get_users',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      const users = await Users.find().sort({ familyName: 1, givenName: 1 });

      res.send(users);
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

        if (user) {
          res.send({
            type: MessageTypeEnum.success,
            message: 'User successfully updated'
          });
        } else {
          res.send({
            type: MessageTypeEnum.error,
            message: 'Something went wrong!'
          });
        }
      } catch (err) {
        res.send({
          type: MessageTypeEnum.error,
          message: err
        });
      }
    }
  );
};
