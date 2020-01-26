import { FIRST, LAST } from '../client/src/utils/constants';
import awardsTypes, { getAward } from './awardTypes';
import awardTypes from './awardTypes';

const mongoose = require('mongoose');
const PererittoUser = mongoose.model('pererittos');
const WinnerDates = mongoose.model('winnerDates');
const CurrentAwards = mongoose.model('currentawards');
const PastAwards = mongoose.model('pastawards');
const Awards = mongoose.model('awards');

const DATE_FRIDAY = 'Fri';
const DATE_13 = '13';
const DATE_2020 = '2020';
const CURRENT_YEAR = new Date().getFullYear();
const PREVIOUS_YEAR = new Date().getFullYear() - 1;

// #region Update Awards
export const updateAwards = async () => {
  try {
    const previousYearInCurrentAwards = await CurrentAwards.find({
      year: PREVIOUS_YEAR
    });

    // Do bulk remove operation
    let bulkRemove = CurrentAwards.collection.initializeUnorderedBulkOp();
    bulkRemove.find({}).remove();
    await bulkRemove.execute();

    if (previousYearInCurrentAwards.length > 0) {
      determineWinners(false, CURRENT_YEAR, PREVIOUS_YEAR);
    }
    determineWinners(true, CURRENT_YEAR, PREVIOUS_YEAR);
  } catch (error) {
    throw error;
  }
};

const determineWinners = async (
  updateCurrentAwards,
  currentYear,
  previousYear
) => {
  try {
    const pererittoPlayers = await PererittoUser.find().lean();
    const players = {};
    const playersArray = [];

    for (let i = 0; i < pererittoPlayers.length; i++) {
      players[pererittoPlayers[i]._id] = 0;
      playersArray.push({
        id: pererittoPlayers[i]._id,
        retired: pererittoPlayers[i].retired,
        retiredDates: pererittoPlayers[i].retiredDates,
        returnedDates: pererittoPlayers[i].returnedDates,
        absentDates: pererittoPlayers[i].absentDates
      });
    }

    if (updateCurrentAwards) {
      const winnerDates = await WinnerDates.find({
        year: currentYear
        // year: 2019
        // year: 2018
      });
      console.log('Winners current year:', winnerDates.length);
      determineAwardTotals(winnerDates, players, currentYear, playersArray);
      // determineAwardTotals(winnerDates, players, 2019, playersArray);
    } else {
      const winnerDates = await WinnerDates.find({
        year: previousYear
      });
      console.log('Winners previous year:', winnerDates.length);
      determineAwardTotals(winnerDates, players, previousYear, playersArray);
    }
  } catch (err) {
    throw err;
  }
};

// ### Logic Gathering below ###

const determineAwardTotals = (winnerDates, players, year, activePlayers) => {
  let latestDate = new Date(0);
  let lastWinner = null;
  let firstWinOfTheYear = null;
  const participated = new Set();
  const playersDateCounts = [];
  const playersFriday13 = [];
  const players2020 = new Set();
  const allPresentPlayers = [];
  const firstChoiceWins = {};
  const lastChoiceWins = {};

  const winnersMap = winnerDates.reduce((result, winner) => {
    if (winner.date) {
      result.push({
        date: new Date(winner.date),
        _winner: winner._winner,
        presentPlayers: winner.presentPlayers,
        choseAndWon: winner.choseAndWon
      });

      if (
        allPresentPlayers.length <= activePlayers.length &&
        winner.presentPlayers.length
      ) {
        for (let i = 0; i < winner.presentPlayers.length; i++) {
          if (!allPresentPlayers.includes(winner.presentPlayers[i])) {
            allPresentPlayers.push(winner.presentPlayers[i]);
          }
        }
      }
    }
    return result;
  }, []);

  let winnerDatesSorted = [];
  winnerDatesSorted.push(...winnersMap);
  winnerDatesSorted.sort((a, b) => a.date - b.date);

  // Get first win of the year
  if (winnerDatesSorted.length > 0) {
    firstWinOfTheYear = winnerDatesSorted[0]._winner;
  }

  for (let i = 0; i < winnerDates.length; i++) {
    players[winnerDates[i]._winner] += 1;

    const winner = winnerDates[i]._winner.toString();
    if (!playersDateCounts.includes(winner)) playersDateCounts.push(winner);

    if (winnerDates[i].date.includes(DATE_2020))
      players2020.add(winnerDates[i]._winner.toString());

    if (
      winnerDates[i].date.includes(DATE_FRIDAY) &&
      winnerDates[i].date.includes(DATE_13)
    ) {
      playersFriday13.push(winnerDates[i]._winner);
    }

    participated.add(winnerDates[i]._winner.toString());

    let playerWinDate = new Date(winnerDates[i].date);
    if (playerWinDate > latestDate) {
      latestDate = new Date(winnerDates[i].date);
      lastWinner = winnerDates[i]._winner;
    }

    if (winnerDates[i].choseAndWon && winnerDates[i].choseAndWon === FIRST) {
      if (!firstChoiceWins[winner]) firstChoiceWins[winner] = 1;
      else firstChoiceWins[winner] += 1;
    }
    if (winnerDates[i].choseAndWon && winnerDates[i].choseAndWon === LAST) {
      if (!lastChoiceWins[winner]) lastChoiceWins[winner] = 1;
      else lastChoiceWins[winner] += 1;
    }
  }

  const allAllowedRandom = allPresentPlayers.filter(player => {
    const playerActive = activePlayers.find(el => el.id.toString() === player);
    if (playerActive && !playerActive.retired) return true;

    return false;
  });

  determinePositions(players, year, activePlayers, allPresentPlayers);
  determineDateCounts(
    winnerDatesSorted,
    playersDateCounts,
    players,
    year,
    activePlayers,
    allPresentPlayers
  );

  awardParticipated(participated, year);
  if (lastWinner) awardGotItLast(lastWinner, year);
  awardFriday13th(playersFriday13, year);
  awardHindsight(players2020, year);
  if (firstWinOfTheYear) awardYearFirst(firstWinOfTheYear, year);
  if (allAllowedRandom.length > 0 && year === CURRENT_YEAR)
    awardRandom(allAllowedRandom, year);
  if (Object.keys(firstChoiceWins).length > 0)
    awardsTypes.awardFirstChoice(firstChoiceWins, year);
  if (Object.keys(lastChoiceWins).length > 0)
    awardsTypes.awardLastChoice(lastChoiceWins, year);
};

const determinePositions = (
  players,
  year,
  activePlayers,
  allPresentPlayers
) => {
  let first = [];
  let second = [];
  let third = [];
  const last = [];

  const playersMap = Object.keys(players).map(key => {
    return { _id: key, count: players[key] };
  });
  let playersArray = [];
  playersArray.push(...playersMap);
  playersArray.sort((a, b) => b.count - a.count);

  const [retiredPlayers] = getRetiredPlayers(activePlayers, year);

  const highestCountList = {};
  for (let i = 0; i < playersArray.length; i++) {
    const count = playersArray[i].count;
    if (!highestCountList[count]) {
      if (Object.keys(highestCountList).length === 3) break;
      highestCountList[count] = 1;
    } else {
      highestCountList[count] += 1;
    }
  }

  const orderedHighestCount = Object.keys(highestCountList)
    .map(count => Number(count))
    .sort((a, b) => b - a);

  // Get first place player
  if (orderedHighestCount.length > 0 && orderedHighestCount[0] > 0) {
    first = playersArray
      .filter(player => player.count === orderedHighestCount[0])
      .map(player => player._id);
  }
  // Get second place player
  if (orderedHighestCount.length > 1 && orderedHighestCount[1] > 0) {
    second = playersArray
      .filter(player => player.count === orderedHighestCount[1])
      .map(player => player._id);
  }
  // Get third place player
  if (orderedHighestCount.length > 2 && orderedHighestCount[2] > 0) {
    third = playersArray
      .filter(player => player.count === orderedHighestCount[2])
      .map(player => player._id);
  }

  // Get last place player
  const playersLength = playersArray.length;
  if (playersLength > 3) {
    const newDate = new Date(new Date().toDateString());
    let lastScore = Infinity;

    for (let i = playersLength - 1; i >= 0; i--) {
      if (year !== CURRENT_YEAR) {
        const lastDay = new Date(year, 11, 31);
        if (
          !playerRetiredDuring(retiredPlayers, playersArray[i]._id, lastDay)
        ) {
          lastScore = playersArray[i].count;
          break;
        }
      } else if (
        !playerRetiredDuring(retiredPlayers, playersArray[i]._id, newDate)
      ) {
        lastScore = playersArray[i].count;
        break;
      }
    }

    for (let i = 0; i < playersLength; i++) {
      const playerId = playersArray[i]._id;
      if (
        playersArray[i].count === lastScore &&
        !playerRetiredDuring(retiredPlayers, playerId, newDate) &&
        playerWasPresent(allPresentPlayers, playerId)
      ) {
        if (
          !first.includes(playerId) &&
          !second.includes(playerId) &&
          !third.includes(playerId)
        ) {
          last.push(playerId);
        }
      }
    }
  }

  if (first.length > 0) awardFirstPlace(first, year);
  if (second.length > 0) awardSecondPlace(second, year);
  if (third.length > 0) awardThirdPlace(third, year);
  if (first.length + second.length + third.length > 2 && last.length > 0)
    awardLastPlace(last, year);
};

const determineDateCounts = async (
  sortedDates,
  playersWithWins,
  allPlayers,
  year,
  activePlayers,
  allPresentPlayers
) => {
  const players3InARow = [];
  const playersDemiGodlike = [];
  const playersGodlike = [];
  const players3InARowMap = {};
  const playersGodlikeMap = {};
  const playersDemiGodlikeMap = {};
  const retiredPlayersIds = [];
  const totalPlayerAttendance = {};
  const attendance80 = [];
  const attendanceInARowMap = {};
  const attendanceInARow = {};
  const nothingSpecialMap = {};
  const nothingSpecial = {};
  const bifectaMap = {};
  const bifecta = {};
  const trifectaMap = {};
  const trifecta = {};

  for (let i = 0; i < allPresentPlayers.length; i++) {
    players3InARowMap[allPresentPlayers[i]] = 0;
    totalPlayerAttendance[allPresentPlayers[i]] = 0;
    attendanceInARowMap[allPresentPlayers[i]] = 0;
    nothingSpecialMap[allPresentPlayers[i]] = 0;
    bifectaMap[allPresentPlayers[i]] = 0;
    trifectaMap[allPresentPlayers[i]] = 0;
  }

  for (let playerId in allPlayers) {
    playersDemiGodlikeMap[playerId] = 0;
    playersGodlikeMap[playerId] = 0;
  }

  for (let i = 0; i < activePlayers.length; i++) {
    const playerId = activePlayers[i].id.toString();
    const retiredDates = activePlayers[i].retiredDates;
    if (activePlayers[i].retired) {
      if (!retiredPlayersIds.includes(playerId))
        retiredPlayersIds.push(playerId);
    }

    if (retiredDates && retiredDates.length > 0) {
      for (let j = 0; j < retiredDates.length; j++) {
        const inCurrentYear =
          retiredDates[j].year.toString() === year.toString();
        const hasRetiredDates = retiredDates[j].dates.length > 0;
        if (inCurrentYear && hasRetiredDates) {
          break;
        }
      }
    }
  }
  const [retiredPlayers, retiredCurrentYear] = getRetiredPlayers(
    activePlayers,
    year
  );

  for (let i = 0; i < sortedDates.length; i++) {
    const winnerId = sortedDates[i]._winner.toString();
    const winnerDate = sortedDates[i].date;
    const presentPlayers = sortedDates[i].presentPlayers;
    const choseAndWon = sortedDates[i].choseAndWon;
    const defaultFirstDate = new Date('2019-06-01');
    // const playerCreatedDate = new Date(
    //   parseInt(winnerId.substring(0, 8), 16) * 1000
    // );

    for (let j = 0; j < presentPlayers.length; j++) {
      totalPlayerAttendance[presentPlayers[j]] += 1;
    }

    if (!choseAndWon) {
      nothingSpecialMap[winnerId] += 1;
      bifectaMap[winnerId] = 0;
      trifectaMap[winnerId] = 0;
    } else {
      nothingSpecialMap[winnerId] = 0;
      trifectaMap[winnerId] += 1;

      if (choseAndWon === FIRST) {
        if (bifectaMap[winnerId] > 0) {
          if (!bifecta[winnerId]) bifecta[winnerId] = 1;
          else bifecta[winnerId] += 1;

          bifectaMap[winnerId] = 0;
        }
      } else if (choseAndWon === LAST) {
        bifectaMap[winnerId] = 1;
      }

      if (trifectaMap[winnerId] === 3) {
        if (!trifecta[winnerId]) trifecta[winnerId] = 1;
        else trifecta[winnerId] += 1;

        trifectaMap[winnerId] = 0;
      }
    }

    if (nothingSpecialMap[winnerId] === 5) {
      nothingSpecialMap[winnerId] = 0;
      if (!nothingSpecial[winnerId]) nothingSpecial[winnerId] = 1;
      else nothingSpecial[winnerId] += 1;
    }

    for (let player in attendanceInARowMap) {
      if (presentPlayers.includes(player)) {
        attendanceInARowMap[player] += 1;
      } else {
        attendanceInARowMap[player] = 0;
      }

      if (attendanceInARowMap[player] === 20) {
        if (!attendanceInARow[player]) attendanceInARow[player] = 1;
        else attendanceInARow[player] += 1;

        attendanceInARowMap[player] = 0;
      }
    }

    for (let j = 0; j < allPresentPlayers.length; j++) {
      let playerId = allPresentPlayers[j];

      if (winnerId === playerId) {
        players3InARowMap[playerId] += 1;
      } else {
        players3InARowMap[playerId] = 0;
      }

      if (players3InARowMap[playerId] === 3) players3InARow.push(playerId);
    }

    for (let playerId in allPlayers) {
      if (playerWasPresent(presentPlayers, playerId)) {
        const playerCreatedDate = new Date(
          parseInt(playerId.substring(0, 8), 16) * 1000
        );

        if (
          playerRetiredDuring(retiredPlayers, playerId, winnerDate) ||
          (playerCreatedDate > defaultFirstDate &&
            playerCreatedDate > winnerDate)
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

          if (playersDemiGodlikeMap[playerId] === 8) {
            playersDemiGodlike.push(playerId);
          }
          if (playersGodlikeMap[playerId] === 10) {
            playersGodlike.push(playerId);
            playersDemiGodlike.splice(playersDemiGodlike.indexOf(playerId), 1);
          }
        }
      }
    }
  }

  const attendance80Percent = sortedDates.length * 0.8;
  for (let player in totalPlayerAttendance) {
    if (totalPlayerAttendance[player] >= attendance80Percent)
      attendance80.push(player);
  }

  if (players3InARow.length > 0) award3InARow(players3InARow, year);
  if (playersDemiGodlike.length > 0) awardDemiGodlike(playersDemiGodlike, year);
  if (playersGodlike.length > 0) awardGodlike(playersGodlike, year);
  if (retiredCurrentYear.length > 0) awardRetired(retiredCurrentYear, year);
  if (attendance80.length > 0) awardTypes.awardAttendance80(attendance80, year);
  if (Object.keys(attendanceInARow).length > 0)
    awardTypes.awardMainAttender(attendanceInARow, year);
  if (Object.keys(nothingSpecial).length > 0)
    awardTypes.awardNothingSpecial(nothingSpecial, year);
  if (Object.keys(bifecta).length > 0) awardTypes.awardBifecta(bifecta, year);
  if (Object.keys(trifecta).length > 0)
    awardTypes.awardTrifecta(trifecta, year);
};

const playerRetiredDuring = (retiredPlayers, playerId, dateToCheck) => {
  const retiredPlayer = retiredPlayers.filter(player => {
    for (const key in player) {
      return key === playerId;
    }
  });

  if (retiredPlayer.length) {
    const { retired, returned } = retiredPlayer[0][playerId];
    const allRetiredDates = [];
    const allReturnedDates = [];

    if (retired) {
      Object.values(retired).forEach(dates => {
        if (dates.length) {
          allRetiredDates.push(...dates);
        }
      });
    }
    if (returned) {
      Object.values(returned).forEach(dates => {
        if (dates.length) {
          allReturnedDates.push(...dates);
        }
      });
    }

    const beforeRetiredDates = allRetiredDates.filter(d => {
      return d - dateToCheck <= 0;
    });
    const beforeReturnedDates = allReturnedDates.filter(d => {
      return d - dateToCheck <= 0;
    });

    if (beforeRetiredDates.length) {
      if (beforeReturnedDates.length) {
        const maxBeforeRetiredDate = beforeRetiredDates.reduce((a, b) =>
          a > b ? a : b
        );
        const maxBeforeReturndedDate = beforeReturnedDates.reduce((a, b) =>
          a > b ? a : b
        );

        if (maxBeforeReturndedDate < maxBeforeRetiredDate) {
          return true;
        }
        return false;
      }
      return true;
    }
    return false;
  }
  return false;
};

const playerWasPresent = (presentPlayers, playerId) => {
  const playerPresent =
    presentPlayers.length === 0 || presentPlayers.includes(playerId);

  return playerPresent;
};

const getRetiredPlayers = (activePlayers, year) => {
  const allRetiredPlayers = [];
  const retiredCurrentYear = [];

  for (let i = 0; i < activePlayers.length; i++) {
    const playerId = activePlayers[i].id.toString();
    const retiredDates = activePlayers[i].retiredDates;
    const returnedDates = activePlayers[i].returnedDates;
    const allRetiredDates = {};
    const allReturnedDates = {};
    const hasRetired = false;
    const hasReturned = false;

    if (retiredDates && retiredDates.length > 0) {
      for (let i = 0; i < retiredDates.length; i++) {
        allRetiredDates[retiredDates[i].year] = [...retiredDates[i].dates];
        if (
          retiredDates[i].year.toString() === year.toString() &&
          !retiredCurrentYear.includes(playerId)
        )
          retiredCurrentYear.push(playerId);
      }
      hasRetired = true;
    }
    if (returnedDates && returnedDates.length > 0) {
      for (let i = 0; i < returnedDates.length; i++) {
        allReturnedDates[returnedDates[i].year] = [...returnedDates[i].dates];
      }
      hasReturned = true;
    }

    if (hasRetired || hasReturned) {
      allRetiredPlayers.push({
        [playerId]: { retired: allRetiredDates, returned: allReturnedDates }
      });
    }
  }

  return [allRetiredPlayers, retiredCurrentYear];
};

// ^^ ### Logic Gathering above ### ^^

// ### Awards Section below ###

const awardFirstPlace = async (firstArr, year) => {
  try {
    const award = await getAward('first');

    if (award) {
      const awardParams = { year, _award: award };
      for (let first of firstArr) {
        if (year !== CURRENT_YEAR) {
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
  } catch (err) {
    throw err;
  }
};

const awardSecondPlace = async (secondArr, year) => {
  try {
    const award = await getAward('second');

    if (award) {
      const awardParams = { year, _award: award };
      for (let second of secondArr) {
        if (year !== CURRENT_YEAR) {
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
  } catch (err) {
    throw err;
  }
};

const awardThirdPlace = async (thirdArr, year) => {
  try {
    const award = await getAward('third');

    if (award) {
      const awardParams = { year, _award: award };
      for (let third of thirdArr) {
        if (year !== CURRENT_YEAR) {
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
  } catch (err) {
    throw err;
  }
};

const awardYearFirst = async (player, year) => {
  try {
    const award = await getAward('yearFirst');

    if (award) {
      const awardParams = { title: 'First of the year!', year, _award: award };
      if (year !== CURRENT_YEAR) {
        await new PastAwards({
          ...awardParams,
          _pereritto: player
        }).save();
      } else {
        await new CurrentAwards({
          ...awardParams,
          _pereritto: player
        }).save();
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardParticipated = async (participated, year) => {
  try {
    const award = await getAward('participant');

    const awardParams = { title: 'Felt the burn', year, _award: award };
    for (let part of participated) {
      if (year !== CURRENT_YEAR) {
        await new PastAwards({ ...awardParams, _pereritto: part }).save();
      } else {
        await new CurrentAwards({ ...awardParams, _pereritto: part }).save();
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardGotItLast = async (lastWinner, year) => {
  try {
    const award = await getAward('gotItLast');

    if (award) {
      const awardParams = {
        title: 'Afterburner',
        year,
        _award: award,
        _pereritto: lastWinner
      };
      if (year !== CURRENT_YEAR) {
        await new PastAwards(awardParams).save();
      } else {
        await new CurrentAwards(awardParams).save();
      }
    }
  } catch (err) {
    throw err;
  }
};

const award3InARow = async (players3InARow, year) => {
  try {
    const award = await getAward('3InARow');

    if (award) {
      const awardParams = {
        title: '3 in a row',
        year,
        _award: award
      };
      for (let player of players3InARow) {
        if (year !== CURRENT_YEAR) {
          await new PastAwards({ ...awardParams, _pereritto: player }).save();
        } else {
          await new CurrentAwards({
            ...awardParams,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardRandom = async (allPlayers, year) => {
  try {
    const award = await getAward('random');

    if (award) {
      const awardParams = {
        title: 'Random Randy',
        year,
        _award: award
      };
      const randomPlayer =
        allPlayers[Math.floor(Math.random() * allPlayers.length)];

      if (year !== CURRENT_YEAR) {
        await new PastAwards({
          ...awardParams,
          _pereritto: randomPlayer
        }).save();
      } else {
        await new CurrentAwards({
          ...awardParams,
          _pereritto: randomPlayer
        }).save();
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardDemiGodlike = async (playersDemiGodlike, year) => {
  try {
    const award = await getAward('demiGodlike');

    if (award) {
      const awardParams = {
        title: 'Demi-Godlike',
        year,
        _award: award
      };
      for (let player of playersDemiGodlike) {
        if (year !== CURRENT_YEAR) {
          await new PastAwards({ ...awardParams, _pereritto: player }).save();
        } else {
          await new CurrentAwards({
            ...awardParams,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardGodlike = async (playersGodlike, year) => {
  try {
    const award = await getAward('godlike');

    if (award) {
      const awardParams = {
        title: 'Godlike',
        year,
        _award: award
      };
      for (let player of playersGodlike) {
        if (year !== CURRENT_YEAR) {
          await new PastAwards({ ...awardParams, _pereritto: player }).save();
        } else {
          await new CurrentAwards({
            ...awardParams,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardFriday13th = async (players, year) => {
  try {
    const award = await getAward('friday13');

    if (award) {
      const awardParams = {
        title: 'Friday the 13th',
        year,
        _award: award
      };
      for (let player of players) {
        if (year !== CURRENT_YEAR) {
          await new PastAwards({ ...awardParams, _pereritto: player }).save();
        } else {
          await new CurrentAwards({
            ...awardParams,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardLastPlace = async (lastArr, year) => {
  try {
    const award = await getAward('lastPlace');

    if (award) {
      const awardParams = { year, _award: award };
      for (let last of lastArr) {
        if (year !== CURRENT_YEAR) {
          await new PastAwards({
            ...awardParams,
            title: 'Last Place',
            _pereritto: last
          }).save();
        } else {
          await new CurrentAwards({
            ...awardParams,
            title: 'Floating Last',
            _pereritto: last
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardRetired = async (playersRetired, year) => {
  try {
    const award = await getAward('retired');

    if (award) {
      const awardParams = { year, _award: award };
      for (let player of playersRetired) {
        if (year !== CURRENT_YEAR) {
          await new PastAwards({
            ...awardParams,
            title: 'Retired',
            _pereritto: player
          }).save();
        } else {
          await new CurrentAwards({
            ...awardParams,
            title: 'Retired',
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardHindsight = async (playersHindsight, year) => {
  try {
    const award = await getAward('hindsight');

    if (award) {
      const awardParams = { title: 'Hindsight', year, _award: award };
      for (let player of playersHindsight) {
        if (year !== CURRENT_YEAR) {
          await new PastAwards({ ...awardParams, _pereritto: player }).save();
        } else {
          await new CurrentAwards({
            ...awardParams,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

// ^^ ### Awards Section above ### ^^

//#endregion Update Awards
