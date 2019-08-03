import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';
import { updateAwards } from '../core/updateAwards';

const mongoose = require('mongoose');
const WinnerDates = mongoose.model('winnerDates');
const PererittoUsers = mongoose.model('pererittos');

const findPererittoPlayerById = async playerId => {
  try {
    const player = await PererittoUsers.findById(playerId);
    // const params = { _id: _id, colour: player.colour, name: player.name };

    return player;
  } catch (error) {
    console.log('Unable to retrieve player by id:', playerId);
    throw error;
  }
};

const getPlayers = async winner => {
  const player = await findPererittoPlayerById(winner._winner);

  return {
    ...winner._doc,
    _winner: player
  };
};

export default app => {
  app.get(
    '/api/get_winners',
    /*requireLogin,*/ async (req, res) => {
      try {
        // const winners = await WinnerDates.find({
        //   year: parseInt(req.query.year)
        // });
        const winners = await WinnerDates.find();
        const players = await PererittoUsers.find();

        if (winners.length > 0 && players.length > 0) {
          const playerMap = {};
          const transformedWinners = [];

          for (let i = 0; i < players.length; i++) {
            playerMap[players[i]._id] = { ...players[i]._doc };
          }

          for (let i = 0; i < winners.length; i++) {
            transformedWinners.push({
              ...winners[i]._doc,
              _winner: playerMap[winners[i]._winner]
            });
          }

          res.send(transformedWinners);
        } else {
          console.log('No winners to display.');
        }
      } catch (error) {
        res.send({
          type: MessageTypeEnum.error,
          message: `An error occured in retrieving winners`
        });
        throw Error(error);
      }
    }
  );

  app.get(
    '/api/get_winneryears',
    /*requireLogin,*/ async (req, res) => {
      try {
        const winnerDates = await WinnerDates.find();

        if (winnerDates.length > 0) {
          const yearsMap = {};

          winnerDates.map(winner => {
            yearsMap[winner.year] = winner.year;
          });

          const currentYear = new Date().getFullYear();
          if (!yearsMap[currentYear]) yearsMap[currentYear] = currentYear;

          return res.send(yearsMap);
        } else {
          console.log('No winners to display.');
        }
      } catch (err) {
        res.send({
          type: MessageTypeEnum.error,
          message: `An error occured in retrieving winner years`
        });
        throw Error(err);
      }
    }
  );

  app.delete(
    '/api/delete_winner_date',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { date } = req.body;
        const winnerDate = await WinnerDates.findOne({ date });

        if (winnerDate) {
          await WinnerDates.deleteOne({ _id: winnerDate._id });

          updateAwards();

          return res.status(200).send({
            type: MessageTypeEnum.success,
            message: 'Date successfully deleted!'
          });
        } else {
          res.send({
            type: MessageTypeEnum.error,
            message: "That date doesn't exist!"
          });
        }
      } catch (err) {
        console.log(err);
        res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured on delete_winner_date'
        });
      }
    }
  );
};
