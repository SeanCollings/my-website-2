import requireLogin from '../middlewares/requireLogin';
// import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';

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
  app.get('/api/get_winners', requireLogin, async (req, res) => {
    try {
      const winners = await WinnerDates.find();
      const players = await PererittoUsers.find();

      if (winners.length > 0 && players.length > 0) {
        const playerMap = {};
        const transformedWinners = [];
        // const transformedWinners1 = [];
        // for (let i = 0; i < winners.length; i++) {
        //   transformedWinners1.push(await getPlayers(winners[i]));
        // }
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
  });
};
