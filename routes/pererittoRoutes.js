import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const PererittoUser = mongoose.model('pererittos');
const WinnerDates = mongoose.model('winnerDates');

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
        res.status(200).send({
          type: MessageTypeEnum.error,
          message: 'User already exists!'
        });
      } else {
        new PererittoUser({
          name: req.query.name,
          colour: `#${req.query.colour}`
        }).save();

        res.status(200).send({
          type: MessageTypeEnum.success,
          message: 'User successfully added!'
        });
      }
    }
  );

  app.get('/api/get_pereritto', requireLogin, async (req, res) => {
    const users = await PererittoUser.find().sort({ count: -1 });
    res.send(users);
  });

  app.post(
    '/api/update_pereritto',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      const user = await PererittoUser.findOne({ name: req.body.name });

      if (user === null) {
        res.send({
          type: MessageTypeEnum.error,
          message: 'That user does not exist!'
        });
      } else {
        const year = parseInt(req.body.date.substring(11));
        const winnerDateCheck = await WinnerDates.find({ date: req.body.date });

        if (winnerDateCheck.length > 0) {
          res.send({
            type: MessageTypeEnum.error,
            message: 'That date already has a winner!'
          });
        } else {
          await new WinnerDates({
            date: req.body.date,
            year,
            _winner: user
          }).save();

          res.status(200).send({
            type: MessageTypeEnum.success,
            message: 'Pereritto user successfully updated!'
          });
        }
      }
    }
  );

  app.get(
    '/api/delete_pereritto',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      const user = await PererittoUser.findOne({ name: req.query.name });

      if (user === null) {
        res.send({
          type: MessageTypeEnum.error,
          message: 'That user does not exist!'
        });
      } else if (user.count > 0) {
        res.send({
          type: MessageTypeEnum.error,
          message: 'User is already on the board!'
        });
      } else {
        await PererittoUser.deleteOne(user);
        res.status(200).send({
          type: MessageTypeEnum.success,
          message: 'User successfully deleted!'
        });
      }
    }
  );
};
