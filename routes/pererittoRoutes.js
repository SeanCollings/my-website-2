import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum } from '../client/src/utils/constants';
import { getPriority } from 'os';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const PererittoUser = mongoose.model('pererittos');
const WinnerDates = mongoose.model('winnerDates');
const CurrentAwards = mongoose.model('currentawards');
const PastAwards = mongoose.model('pastawards');
const Awards = mongoose.model('awards');

//#region Update Awards
const updateAwards = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = new Date().getFullYear() - 1;
  const previousYearInCurrentAwards = await CurrentAwards.find({
    year: previousYear
  });

  // Do bulk remove operation
  let bulkRemove = CurrentAwards.collection.initializeUnorderedBulkOp();
  bulkRemove.find({}).remove();
  await bulkRemove.execute();

  if (previousYearInCurrentAwards.length > 0) {
    createAwards(false, currentYear, previousYear);
  }

  createAwards(true, currentYear, previousYear);
};

const createAwards = async (updateCurrentAwards, currentYear, previousYear) => {
  const pererittoPlayers = await PererittoUser.find();

  const players = {};
  for (let i = 0; i < pererittoPlayers.length; i++) {
    players[pererittoPlayers[i]._id] = 0;
  }

  if (updateCurrentAwards) {
    const winnerDates = await WinnerDates.find({
      year: currentYear
    });
    console.log('Winners current year:', winnerDates.length);
    determineAwardTotals(winnerDates, players, currentYear);
  } else {
    const winnerDates = await WinnerDates.find({
      year: previousYear
    });
    console.log('Winners previous year:', winnerDates.length);
    determineAwardTotals(winnerDates, players, previousYear);
  }
};

//### AWARDS ###
const determineAwardTotals = (winnerDates, players, year) => {
  let latestDate = new Date(0);
  let lastWinner = null;
  const participated = new Set();

  for (let i = 0; i < winnerDates.length; i++) {
    players[winnerDates[i]._winner] += 1;

    participated.add(winnerDates[i]._winner.toString());

    let playerWinDate = new Date(winnerDates[i].date);
    if (playerWinDate > latestDate) {
      latestDate = new Date(winnerDates[i].date);
      lastWinner = winnerDates[i]._winner;
    }
  }

  determinePositions(players, year);
  awardParticipated(participated, year);
  awardGotItLast(lastWinner, year);
};

const determinePositions = (players, year) => {
  let first = [];
  let second = [];
  let third = [];

  const playersMap = Object.keys(players).map(key => {
    return { _id: key, count: players[key] };
  });
  let playersArray = [];
  playersArray.push(...playersMap);
  playersArray.sort((a, b) => b.count - a.count);

  if (playersArray[0].count !== 0) first.push(playersArray[0]._id);

  if (playersArray[1].count !== 0) {
    if (playersArray[1].count === playersArray[0].count) {
      first.push(playersArray[1]._id);
    } else {
      second.push(playersArray[1]._id);
    }
  }

  if (playersArray[2].count !== 0) {
    if (playersArray[2].count === playersArray[0].count) {
      first.push(playersArray[2]._id);
    } else if (playersArray[2].count === playersArray[1].count) {
      second.push(playersArray[2]._id);
    } else third.push(playersArray[2]._id);
  }

  if (first.length > 0) awardFirstPlace(first, year);
  if (second.length > 0) awardSecondPlace(second, year);
  if (third.length > 0) awardThirdPlace(third, year);
};

const awardParticipated = async (participated, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: 'participant'
    },
    { _id: 1 }
  ).limit(1);

  const awardParams = { title: 'Participated', year, _award: award };
  for (let part of participated) {
    if (year !== currentYear) {
      await new PastAwards({ ...awardParams, _pereritto: part }).save();
    } else {
      await new CurrentAwards({ ...awardParams, _pereritto: part }).save();
    }
  }
};

const awardGotItLast = async (lastWinner, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: 'gotItLast'
    },
    { _id: 1 }
  ).limit(1);

  const awardParams = {
    title: 'Got it last',
    year,
    _award: award,
    _pereritto: lastWinner
  };
  if (year !== currentYear) {
    await new PastAwards(awardParams).save();
  } else {
    await new CurrentAwards(awardParams).save();
  }
};

const awardFirstPlace = async (firstArr, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: 'first'
    },
    { _id: 1 }
  ).limit(1);

  const awardParams = { year, _award: award };
  for (let first of firstArr) {
    if (year !== currentYear) {
      await new PastAwards({
        ...awardParams,
        title: 'Winner',
        _pereritto: first
      }).save();
    } else {
      await new CurrentAwards({
        ...awardParams,
        title: 'Floating Winner',
        _pereritto: first
      }).save();
    }
  }
};

const awardSecondPlace = async (secondArr, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: 'second'
    },
    { _id: 1 }
  ).limit(1);

  const awardParams = { year, _award: award };
  for (let second of secondArr) {
    if (year !== currentYear) {
      await new PastAwards({
        ...awardParams,
        title: 'Second Place',
        _pereritto: second
      }).save();
    } else {
      await new CurrentAwards({
        ...awardParams,
        title: 'Floating Second',
        _pereritto: second
      }).save();
    }
  }
};

const awardThirdPlace = async (thirdArr, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: 'third'
    },
    { _id: 1 }
  ).limit(1);

  const awardParams = { year, _award: award };
  for (let third of thirdArr) {
    if (year !== currentYear) {
      await new PastAwards({
        ...awardParams,
        title: 'Third Place',
        _pereritto: third
      }).save();
    } else {
      await new CurrentAwards({
        ...awardParams,
        title: 'Floating Third',
        _pereritto: third
      }).save();
    }
  }
};

//### ###### ###

//#endregion Update Awards

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

          updateAwards();

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

              await Users.updateOne(
                { _pereritto },
                { $unset: { _pereritto: '' } }
              );

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
