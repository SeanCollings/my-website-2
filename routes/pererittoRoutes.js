import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const PererittoUser = mongoose.model('pererittos');
const WinnerDates = mongoose.model('winnerDates');

export default app => {
  app.get('/api/pereritto', requireLogin, (req, res) => {
    res.sendStatus(200);
  });

  //#region add_pereritto
  app.post(
    '/api/add_pereritto',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { _id, name, colour, _pereritto } = req.body;
        const existingPlayer = await PererittoUser.findOne({ _id: _pereritto });

        if (existingPlayer) {
          return res.send({
            type: MessageTypeEnum.error,
            message: 'User already exists!'
          });
        }

        const existingColour = await PererittoUser.findOne({
          colour: new RegExp(colour, 'i')
        });

        if (existingColour) {
          return res.send({
            type: MessageTypeEnum.error,
            message: 'Colour already used! Select another'
          });
        }

        const newPlayer = await new PererittoUser({
          name: name,
          colour: `#${colour}`
        }).save();

        await Users.updateOne({ _id }, { $set: { _pereritto: newPlayer._id } });

        res.status(200).send({
          type: MessageTypeEnum.success,
          message: 'User successfully added!'
        });
      } catch (err) {
        console.log(err);
        return res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured in add_pereritto.'
        });
      }
    }
  );
  //#endregion add_pereritto

  //#region get_pereritto
  app.get('/api/get_pereritto', requireLogin, async (req, res) => {
    const users = await PererittoUser.find().sort({ name: 1 });
    res.send(users);
  });
  //#endregion get_pereritto

  //#region update_pereritto
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
  //#endregion update_pereritto

  //#region delete_pereritto
  app.delete(
    '/api/delete_pereritto',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { _id, _pereritto } = req.body;
        const user = await Users.findById({ _id });

        if (user._pereritto.toString() === _pereritto) {
          const pererittoPlayer = await PererittoUser.findOne({
            _id: _pereritto
          });

          if (pererittoPlayer) {
            const winnerDates = await WinnerDates.find({ _winner: _pereritto });

            if (winnerDates.length > 0) {
              return res.send({
                type: MessageTypeEnum.error,
                message: 'User is already on the board!'
              });
            } else {
              await PererittoUser.deleteOne(pererittoPlayer);

              return res.status(200).send({
                type: MessageTypeEnum.success,
                message: 'User successfully deleted!'
              });
            }
          } else {
            return res.send({
              type: MessageTypeEnum.error,
              message: 'That player does not exist!'
            });
          }
        } else {
          return res.send({
            type: MessageTypeEnum.error,
            message: "That user isn't linked to a player!"
          });
        }
      } catch (err) {
        console.log(err);
        res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured on delete_pereritto'
        });
      }
    }
  );
  //#endregion delete_pereritto
};
