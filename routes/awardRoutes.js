import requireLogin from '../middlewares/requireLogin';

const mongoose = require('mongoose');
const Awards = mongoose.model('awards');
const CurrentAwards = mongoose.model('currentawards');
const PastAwards = mongoose.model('pastawards');
const PererittoUser = mongoose.model('pererittos');

export default app => {
  app.get('/api/get_userawards', requireLogin, async (req, res) => {
    try {
      const pererittoUser = await PererittoUser.findOne({
        _id: req.user._pereritto
      });

      if (pererittoUser) {
        const allAwards = [];
        const currentAwards = await CurrentAwards.find({
          _pereritto: pererittoUser._id
        });
        const pastAwards = await PastAwards.find({
          _pereritto: pererittoUser._id
        });
        const awards = await Awards.find();

        const awardsMap = {};
        for (let i = 0; i < awards.length; i++) {
          awardsMap[awards[i]._id] = { ...awards[i]._doc };
        }

        if (currentAwards.length > 0) {
          // console.log('Found currentawards');
          let transformedCurrentAwards = [];
          for (let i = 0; i < currentAwards.length; i++) {
            transformedCurrentAwards.push({
              ...currentAwards[i]._doc,
              _award: awardsMap[currentAwards[i]._award]
            });
          }
          transformedCurrentAwards.sort((a, b) => {
            return a._award.position - b._award.position;
          });

          allAwards.push(...transformedCurrentAwards);
        }

        if (pastAwards.length > 0) {
          // console.log('Found pastawards');
          let transformedPastAwards = [];
          for (let i = 0; i < pastAwards.length; i++) {
            transformedPastAwards.push({
              ...pastAwards[i]._doc,
              _award: awardsMap[pastAwards[i]._award]
            });
          }
          transformedPastAwards.sort((a, b) => {
            return a._award.position - b._award.position;
          });

          allAwards.push(...transformedPastAwards);
        }

        return res.send({ allAwards });
      }

      return res.status(404);
    } catch (error) {
      throw error;
    }
  });

  app.get('/api/get_userawards_total', requireLogin, async (req, res) => {
    try {
      const pererittoUser = await PererittoUser.findOne({
        _id: req.user._pereritto
      });

      if (pererittoUser) {
        const excludedAwardTypes = ['retired'];
        const excludedAwards = ['Retired'];

        const awards = await Awards.find(
          { type: { $nin: excludedAwardTypes } },
          { _id: 1, type: 1 }
        );
        const currentAwards = await CurrentAwards.find(
          {
            _pereritto: pererittoUser._id,
            title: { $nin: excludedAwards }
          },
          { _award: 1, type: 1 }
        );
        const pastAwards = await PastAwards.find(
          {
            _pereritto: pererittoUser._id,
            title: { $nin: excludedAwards }
          },
          { _award: 1, type: 1 }
        );

        const awardsTogether = [...currentAwards, ...pastAwards];
        const uniqueAwards = [
          ...new Set(awardsTogether.map(item => item._award.toString()))
        ];

        if (!awardsTogether || !uniqueAwards) {
          return res.send({
            userAwards: 0,
            totalAwards: 0
          });
        }

        return res.send({
          userAwards: uniqueAwards.length,
          totalAwards: awards.length
        });
      }

      return res.status(404);
    } catch (error) {
      throw error;
    }
  });
};
