import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';

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
};
