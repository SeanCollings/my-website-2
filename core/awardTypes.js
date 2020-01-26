const mongoose = require('mongoose');
const Awards = mongoose.model('awards');
const CurrentAwards = mongoose.model('currentawards');
const PastAwards = mongoose.model('pastawards');

const CURRENT_YEAR = new Date().getFullYear();

const getTotal = (players, player) =>
  `${players[player] > 1 ? ` (${players[player]})` : ''}`;

export const getAward = async type =>
  await Awards.findOne(
    {
      type
    },
    { _id: 1 }
  ).limit(1);

const saveAward = (params, year) => {
  if (year !== CURRENT_YEAR) {
    new PastAwards({
      ...params
    }).save();
  } else {
    new CurrentAwards({
      ...params
    }).save();
  }
};

const awardFirstChoice = async (players, year) => {
  try {
    const award = await getAward('choiceFirst');

    if (award) {
      for (let player of Object.keys(players)) {
        const params = {
          year,
          _award: award,
          title: `First Choice Win${getTotal(players, player)}`,
          _pereritto: player
        };

        saveAward(params, year);
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardLastChoice = async (players, year) => {
  try {
    const award = await getAward('choiceLast');

    if (award) {
      for (let player of Object.keys(players)) {
        const params = {
          year,
          _award: award,
          title: `Last Choice Win${getTotal(players, player)}`,
          _pereritto: player
        };

        saveAward(params, year);
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardBifecta = async (players, year) => {
  try {
    const award = await getAward('bifecta');

    if (award) {
      const awardParams = { year, _award: award };
      for (let player of Object.keys(players)) {
        const title = `Bifecta${getTotal(players, player)}`;
        if (year !== CURRENT_YEAR) {
          new PastAwards({
            ...awardParams,
            title,
            _pereritto: player
          }).save();
        } else {
          new CurrentAwards({
            ...awardParams,
            title,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardTrifecta = async (players, year) => {
  try {
    const award = await getAward('trifecta');

    if (award) {
      for (let player of Object.keys(players)) {
        const params = {
          year,
          _award: award,
          title: `Trifecta${getTotal(players, player)}`,
          _pereritto: player
        };

        saveAward(params, year);
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardMainAttender = async (players, year) => {
  try {
    const award = await getAward('mainAttender');

    if (award) {
      const awardParams = { year, _award: award };
      for (let player of Object.keys(players)) {
        const title = `Main Attender${getTotal(players, player)}`;
        if (year !== CURRENT_YEAR) {
          new PastAwards({
            ...awardParams,
            title,
            _pereritto: player
          }).save();
        } else {
          new CurrentAwards({
            ...awardParams,
            title,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardAttendance80 = async (players, year) => {
  try {
    const award = await getAward('attendance80');

    if (award) {
      const awardParams = { year, _award: award };
      for (let player of players) {
        const title = `Attendance +80%`;
        if (year !== CURRENT_YEAR) {
          new PastAwards({
            ...awardParams,
            title,
            _pereritto: player
          }).save();
        } else {
          new CurrentAwards({
            ...awardParams,
            title,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

const awardNothingSpecial = async (players, year) => {
  try {
    const award = await getAward('nothingSpecial');

    if (award) {
      const awardParams = { year, _award: award };
      for (let player of Object.keys(players)) {
        const title = `Nothing Special${getTotal(players, player)}`;
        if (year !== CURRENT_YEAR) {
          new PastAwards({
            ...awardParams,
            title,
            _pereritto: player
          }).save();
        } else {
          new CurrentAwards({
            ...awardParams,
            title,
            _pereritto: player
          }).save();
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

export default {
  awardFirstChoice,
  awardLastChoice,
  awardBifecta,
  awardTrifecta,
  awardMainAttender,
  awardAttendance80,
  awardNothingSpecial
};
