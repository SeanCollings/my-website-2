const mongoose = require('mongoose');
const PererittoUser = mongoose.model('pererittos');
const WinnerDates = mongoose.model('winnerDates');
const CurrentAwards = mongoose.model('currentawards');
const PastAwards = mongoose.model('pastawards');
const Awards = mongoose.model('awards');

// #region Update Awards
export const updateAwards = async () => {
  try {
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
      determineWinners(false, currentYear, previousYear);
    }
    determineWinners(true, currentYear, previousYear);
  } catch (error) {
    throw error;
  }
};

const determineWinners = async (
  updateCurrentAwards,
  currentYear,
  previousYear
) => {
  const pererittoPlayers = await PererittoUser.find();
  const players = {};
  const playersArray = [];

  for (let i = 0; i < pererittoPlayers.length; i++) {
    players[pererittoPlayers[i]._id] = 0;
    playersArray.push(pererittoPlayers[i]._id);
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

  if (playersArray.length > 0) awardRandom(playersArray, currentYear);
};

// ### Logic Gathering below ###

const determineAwardTotals = (winnerDates, players, year) => {
  let latestDate = new Date(0);
  let lastWinner = null;
  const participated = new Set();
  const playersDateCounts = [];

  const winnersMap = winnerDates.reduce((result, winner) => {
    if (winner.date) {
      result.push({ date: new Date(winner.date), _winner: winner._winner });
    }
    return result;
  }, []);

  let winnerDatesSorted = [];
  winnerDatesSorted.push(...winnersMap);
  winnerDatesSorted.sort((a, b) => a.date - b.date);

  for (let i = 0; i < winnerDates.length; i++) {
    players[winnerDates[i]._winner] += 1;

    const winner = winnerDates[i]._winner.toString();
    if (!playersDateCounts.includes(winner)) playersDateCounts.push(winner);

    participated.add(winnerDates[i]._winner.toString());

    let playerWinDate = new Date(winnerDates[i].date);
    if (playerWinDate > latestDate) {
      latestDate = new Date(winnerDates[i].date);
      lastWinner = winnerDates[i]._winner;
    }
  }

  determinePositions(players, year);
  determineDateCounts(winnerDatesSorted, playersDateCounts, players, year);
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

const determineDateCounts = async (
  sortedDates,
  playersWithWins,
  allPlayers,
  year
) => {
  const players3InARow = [];
  const playersDemiGodlike = [];
  const playersGodlike = [];
  const players3InARowMap = {};
  const playersGodlikeMap = {};
  const playersDemiGodlikeMap = {};

  for (let i = 0; i < playersWithWins.length; i++) {
    players3InARowMap[playersWithWins[i]] = 0;
  }

  for (let playerId in allPlayers) {
    playersDemiGodlikeMap[playerId] = 0;
    playersGodlikeMap[playerId] = 0;
  }

  for (let i = 0; i < sortedDates.length; i++) {
    const winnerId = sortedDates[i]._winner.toString();
    const winnerDate = sortedDates[i].date;
    const defaultFirstDate = new Date('2019-06-01');
    // const playerCreatedDate = new Date(
    //   parseInt(winnerId.substring(0, 8), 16) * 1000
    // );

    for (let j = 0; j < playersWithWins.length; j++) {
      let playerId = playersWithWins[j];

      if (winnerId === playerId) {
        players3InARowMap[playerId] += 1;
      } else {
        players3InARowMap[playerId] = 0;
      }

      if (players3InARowMap[playerId] === 3) players3InARow.push(playerId);
    }

    for (let playerId in allPlayers) {
      const playerCreatedDate = new Date(
        parseInt(playerId.substring(0, 8), 16) * 1000
      );
      if (
        playerCreatedDate > defaultFirstDate &&
        playerCreatedDate > winnerDate
      ) {
        continue;
      } else {
        if (winnerId === playerId) {
          playersDemiGodlikeMap[playerId] = 0;
          playersGodlikeMap[playerId] = 0;
        } else {
          playersDemiGodlikeMap[playerId] += 1;
          playersGodlikeMap[playerId] += 1;
        }

        if (playersDemiGodlikeMap[playerId] === 8)
          playersDemiGodlike.push(playerId);
        if (playersGodlikeMap[playerId] === 10) playersGodlike.push(playerId);
      }
    }
  }

  if (players3InARow.length > 0) award3InARow(players3InARow, year);
  if (playersDemiGodlike.length > 0) awardDemiGodlike(playersDemiGodlike, year);
  if (playersGodlike.length > 0) awardGodlike(playersGodlike, year);
};

// ^^ ### Logic Gathering above ### ^^

// ### Awards Section below ###

const awardFirstPlace = async (firstArr, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: 'first'
    },
    { _id: 1 }
  ).limit(1);

  if (award) {
    const awardParams = { year, _award: award };
    for (let first of firstArr) {
      if (year !== currentYear) {
        await new PastAwards({
          ...awardParams,
          title: 'Winner!',
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

  if (award) {
    const awardParams = { year, _award: award };
    for (let second of secondArr) {
      if (year !== currentYear) {
        await new PastAwards({
          ...awardParams,
          title: 'Second Place!',
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

  if (award) {
    const awardParams = { year, _award: award };
    for (let third of thirdArr) {
      if (year !== currentYear) {
        await new PastAwards({
          ...awardParams,
          title: 'Third Place!',
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
  }
};

const awardParticipated = async (participated, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: 'participant'
    },
    { _id: 1 }
  ).limit(1);

  const awardParams = { title: 'Felt the burn', year, _award: award };
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

  if (award) {
    const awardParams = {
      title: 'Afterburner',
      year,
      _award: award,
      _pereritto: lastWinner
    };
    if (year !== currentYear) {
      await new PastAwards(awardParams).save();
    } else {
      await new CurrentAwards(awardParams).save();
    }
  }
};

const award3InARow = async (players3InARow, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: '3InARow'
    },
    { _id: 1 }
  ).limit(1);

  if (award) {
    const awardParams = {
      title: '3 in a row',
      year,
      _award: award
    };
    for (let player of players3InARow) {
      if (year !== currentYear) {
        await new PastAwards({ ...awardParams, _pereritto: player }).save();
      } else {
        await new CurrentAwards({ ...awardParams, _pereritto: player }).save();
      }
    }
  }
};

const awardRandom = async (allPlayers, year) => {
  const currentYear = new Date().getFullYear();
  const award = await Awards.findOne(
    {
      type: 'random'
    },
    { _id: 1 }
  ).limit(1);

  if (award) {
    const awardParams = {
      title: 'Random Randy',
      year,
      _award: award
    };

    const randomPlayer =
      allPlayers[Math.floor(Math.random() * allPlayers.length)];

    if (year !== currentYear) {
      await new PastAwards({ ...awardParams, _pereritto: randomPlayer }).save();
    } else {
      await new CurrentAwards({
        ...awardParams,
        _pereritto: randomPlayer
      }).save();
    }
  }
};

const awardDemiGodlike = async (playersDemiGodlike, year) => {
  const currentYear = new Date().getFullYear();

  const award = await Awards.findOne(
    {
      type: 'demiGodlike'
    },
    { _id: 1 }
  ).limit(1);

  if (award) {
    const awardParams = {
      title: 'Demi-Godlike',
      year,
      _award: award
    };
    for (let player of playersDemiGodlike) {
      if (year !== currentYear) {
        await new PastAwards({ ...awardParams, _pereritto: player }).save();
      } else {
        await new CurrentAwards({ ...awardParams, _pereritto: player }).save();
      }
    }
  }
};

const awardGodlike = async (playersGodlike, year) => {
  const currentYear = new Date().getFullYear();

  const award = await Awards.findOne(
    {
      type: 'godlike'
    },
    { _id: 1 }
  ).limit(1);

  if (award) {
    const awardParams = {
      title: 'Godlike',
      year,
      _award: award
    };
    for (let player of playersGodlike) {
      if (year !== currentYear) {
        await new PastAwards({ ...awardParams, _pereritto: player }).save();
      } else {
        await new CurrentAwards({ ...awardParams, _pereritto: player }).save();
      }
    }
  }
};

// ^^ ### Awards Section above ### ^^

//#endregion Update Awards
