import requireLogin from '../middlewares/requireLogin';
// import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const WinnerDates = mongoose.model('winnerDates');
const PererittoUser = mongoose.model('pererittos');

const findPererittoPlayerById = async playerId => {
  try {
    const player = await PererittoUser.findById(playerId);

    return { ...player._doc };
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

      if (winners.length > 0) {
        const transformedWinners = [];
        for (let i = 0; i < winners.length; i++) {
          transformedWinners.push(await getPlayers(winners[i]));
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
