import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';

const mongoose = require('mongoose');
const PererittoUser = mongoose.model('pererittos');

export default app => {
  app.get('/api/pereritto', requireLogin, (req, res) => {
    res.sendStatus(200);
  });

  app.get(
    '/api/add_pereritto',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      const existingUser = await PererittoUser.find({ name: req.query.name });

      if (existingUser.length > 0) {
        res.send({ error: 'User already exists!' });
      } else {
        const user = await new PererittoUser({
          name: req.query.name,
          colour: req.query.colour
        }).save();

        res.sendStatus(200);
      }
    }
  );

  app.get('/api/get_pereritto', requireLogin, async (req, res) => {
    const users = await PererittoUser.find().sort({ count: -1 });
    res.send(users);
  });
};
