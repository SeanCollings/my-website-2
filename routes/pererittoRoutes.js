import requireLogin from '../middlewares/requireLogin';
import requireSuperAccess from '../middlewares/requireSuperAccess';
import { MessageTypeEnum, MYSTERY } from '../client/src/utils/constants';
import { updateAwards } from '../core/updateAwards';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const PererittoUser = mongoose.model('pererittos');
const WinnerDates = mongoose.model('winnerDates');

export default app => {
  app.get('/api/pereritto', requireLogin, (req, res) => {
    try {
      res.sendStatus(200);
    } catch (err) {
      throw err;
    }
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
  app.get('/api/get_pereritto', async (req, res) => {
    try {
      const users = await PererittoUser.find().sort({ name: 1 });
      res.send(users);
    } catch (err) {
      throw err;
    }
  });
  //#endregion get_pereritto

  //#region update_pereritto
  app.post(
    '/api/update_pereritto',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { id, date, presentPlayers, choseAndWon } = req.body;
        const mysteryPlayer = id === MYSTERY;

        const user =
          !mysteryPlayer && (await PererittoUser.findOne({ _id: id }));

        if (!mysteryPlayer && !user) {
          return res.send({
            type: MessageTypeEnum.error,
            message: 'That user does not exist!'
          });
        } else {
          const currentYear = new Date().getFullYear();
          const year = parseInt(date.substring(11));
          const winnerDateCheck = await WinnerDates.find({ date: date });

          if (year < currentYear) {
            return res.send({
              type: MessageTypeEnum.error,
              message: 'Past awards are not allowed!'
            });
          }

          if (winnerDateCheck.length > 0) {
            return res.send({
              type: MessageTypeEnum.error,
              message: 'That date already has a winner!'
            });
          } else {
            await new WinnerDates({
              date: date,
              year,
              presentPlayers,
              choseAndWon,
              _winner: mysteryPlayer ? undefined : user
            }).save();

            updateAwards();

            return res.status(200).send({
              type: MessageTypeEnum.success,
              message: 'Pereritto user successfully updated!'
            });
          }
        }
      } catch (err) {
        throw err;
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

  //#region retire_pereritto
  app.post(
    '/api/retire_pereritto',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { _pereritto } = req.body;
        const pererittoPlayer = await PererittoUser.findOne(
          {
            _id: _pereritto
          },
          { retiredDates: 1, returnedDates: 1, retired: 1 }
        );

        if (pererittoPlayer) {
          const currentYear = new Date().getFullYear().toString();
          const newDate = new Date(new Date().toDateString());
          const { retiredDates, retired } = pererittoPlayer;

          if (retired) {
            return res.send({
              type: MessageTypeEnum.error,
              message: 'That player is already retired!'
            });
          }

          if (retiredDates.length > 0) {
            const allYears = [];
            const allYearsAndDates = [...retiredDates];

            for (let i = 0; i < retiredDates.length; i++) {
              allYears.push(retiredDates[i].year);
            }

            if (!allYears.includes(currentYear)) {
              const newRetiredDates = {
                year: currentYear,
                dates: [newDate]
              };
              allYearsAndDates.push(newRetiredDates);
              await PererittoUser.updateOne(
                { _id: _pereritto },
                { $set: { retired: true, retiredDates: allYearsAndDates } }
              );
            } else {
              const currentRetiredYear = retiredDates.filter(
                date => date.year === currentYear
              )[0];
              const currentYearsDates = [...currentRetiredYear.dates];
              currentYearsDates.push(newDate);
              const newCurrentYear = {
                year: currentYear,
                dates: currentYearsDates
              };
              const newYearAndDates = allYearsAndDates.filter(
                el => el.year.toString() !== currentYear
              );
              newYearAndDates.push(newCurrentYear);
              await PererittoUser.updateOne(
                { _id: _pereritto },
                { $set: { retired: true, retiredDates: newYearAndDates } }
              );
            }
          } else {
            const newRetiredDates = [{ year: currentYear, dates: [newDate] }];
            await PererittoUser.updateOne(
              { _id: _pereritto },
              { $set: { retired: true, retiredDates: newRetiredDates } }
            );
          }

          return res.status(200).send({
            type: MessageTypeEnum.success,
            message: 'Player successfully retired!'
          });
        } else {
          return res.send({
            type: MessageTypeEnum.error,
            message: 'That pereritto player does not exist!'
          });
        }
      } catch (err) {
        console.log(err);
        res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured on retire_pereritto'
        });
      }
    }
  );
  //#endregion retire_pereritto

  //#region return_pereritto
  app.post(
    '/api/return_pereritto',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { _pereritto } = req.body;
        const pererittoPlayer = await PererittoUser.findOne(
          {
            _id: _pereritto
          },
          { retiredDates: 1, returnedDates: 1, retired: 1 }
        );

        if (pererittoPlayer) {
          const currentYear = new Date().getFullYear().toString();
          const newDate = new Date(new Date().toDateString());
          const { returnedDates, retired } = pererittoPlayer;

          if (!retired) {
            return res.send({
              type: MessageTypeEnum.error,
              message: 'That player is not retired!'
            });
          }

          if (returnedDates.length > 0) {
            const allYears = [];
            const allYearsAndDates = [...returnedDates];

            for (let i = 0; i < returnedDates.length; i++) {
              allYears.push(returnedDates[i].year);
            }

            if (!allYears.includes(currentYear)) {
              const newReturnedDates = {
                year: currentYear,
                dates: [newDate]
              };
              allYearsAndDates.push(newReturnedDates);
              await PererittoUser.updateOne(
                { _id: _pereritto },
                { $set: { retired: false, returnedDates: allYearsAndDates } }
              );
            } else {
              const currentReturnedYear = returnedDates.filter(
                date => date.year === currentYear
              )[0];
              const currentYearsDates = [...currentReturnedYear.dates];
              currentYearsDates.push(newDate);
              const newCurrentYear = {
                year: currentYear,
                dates: currentYearsDates
              };
              const newYearAndDates = allYearsAndDates.filter(
                el => el.year.toString() !== currentYear
              );
              newYearAndDates.push(newCurrentYear);
              await PererittoUser.updateOne(
                { _id: _pereritto },
                { $set: { retired: false, returnedDates: newYearAndDates } }
              );
            }
          } else {
            const newReturnedDates = [{ year: currentYear, dates: [newDate] }];
            await PererittoUser.updateOne(
              { _id: _pereritto },
              { $set: { retired: false, returnedDates: newReturnedDates } }
            );
          }

          return res.status(200).send({
            type: MessageTypeEnum.success,
            message: 'Player successfully returned!'
          });
        } else {
          return res.send({
            type: MessageTypeEnum.error,
            message: 'That pereritto player does not exist!'
          });
        }
      } catch (err) {
        console.log(err);
        res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured on retire_pereritto'
        });
      }
    }
  );
  //#endregion return_pereritto

  //#region mark_player_absent
  app.post(
    '/api/mark_player_absent',
    requireLogin,
    requireSuperAccess,
    async (req, res) => {
      try {
        const { date, id } = req.body;
        const pererittoPlayer = await PererittoUser.findOne({
          _id: id
        });

        if (pererittoPlayer.absentDates.includes(date)) {
          res.send({
            type: MessageTypeEnum.error,
            message: 'That date already marked absent!'
          });
        } else {
          const newAbsentDates = [...pererittoPlayer.absentDates];
          newAbsentDates.push(date);

          await PererittoUser.updateOne(
            { _id: id },
            { $set: { absentDates: newAbsentDates } }
          );

          return res.status(200).send({
            type: MessageTypeEnum.success,
            message: 'Player marked absent!'
          });
        }
      } catch (err) {
        console.log(err);
        res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured on mark_player_absent'
        });
      }
    }
  );
  //#endregion mark_player_absent
};
