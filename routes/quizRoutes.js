import requireLogin from '../middlewares/requireLogin';
import {
  MessageTypeEnum,
  MAX_ANSWER_LENGTH,
  MAX_QUESTION_LENGTH,
  EDIT_DELETE_CONTENT,
  EDIT_UPDATE_CONTENT,
  CONTINUE_QUIZ,
  ALL_PUBLIC_QUIZ,
  ALL_OWN_QUIZ,
  DEFAULT_QUIZ,
  FIRST_PART,
  INITIAL_BATCH_SIZE,
  LAST_PART
} from '../client/src/utils/constants';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const QuizGroup = mongoose.model('quizgroups');
const QuizContent = mongoose.model('quizcontent');
const QuizRound = mongoose.model('quizrounds');

const getFormattedDate = date =>
  date
    .toString()
    .split('GMT')[0]
    .trim();

export default app => {
  app.post('/api/save_quiz', requireLogin, async (req, res) => {
    try {
      const {
        quiz: { title, contents, isPublic, createdDate }
      } = req.body;
      const { _id } = req.user;

      const incorrectPayload =
        !contents ||
        contents.length === 0 ||
        contents.some(content => {
          const { question, answer } = content;

          return (
            !question ||
            !answer ||
            answer.length > MAX_ANSWER_LENGTH ||
            question.length > MAX_QUESTION_LENGTH
          );
        });

      if (incorrectPayload) {
        return res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured!'
        });
      }

      const quizTitle =
        title.length > 0 ? title : getFormattedDate(createdDate);

      const newGroup = await new QuizGroup({
        title: quizTitle,
        isPublic,
        createdDate,
        _user: _id
      }).save();

      if (newGroup && contents.length > 0) {
        contents.forEach(content => {
          new QuizContent({
            question: content.question,
            answer: content.answer,
            isPublic,
            _user: _id,
            _quizGroup: newGroup._id
          }).save();
        });
      }

      if (isPublic) {
        await QuizRound.updateMany({}, { $set: { requiresUpdate: true } });
      }

      return res.send({
        type: MessageTypeEnum.success,
        message: 'New quiz saved!'
      });
    } catch (err) {
      console.log(err);
      res.send({
        type: MessageTypeEnum.error,
        message: 'An error occured!'
      });
    }
  });

  app.get('/api/get_saved_quizzes', requireLogin, async (req, res) => {
    try {
      const { _id } = req.user;
      const savedGroups = await QuizGroup.find({ _user: _id }).sort({
        createdDate: 1
      });

      if (savedGroups.length > 0) {
        const allGroupsAndContent = await Promise.all(
          savedGroups.map(async group => ({
            group,
            content: await QuizContent.find(
              { _quizGroup: group._id },
              { question: 1, answer: 1, _id: 1 }
            )
          }))
        );

        return res.send([...allGroupsAndContent]);
      } else {
        return res.send([]);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

  app.get('/api/get_total_questions', async (req, res) => {
    try {
      const { _id } = req.user;
      const allContent = await QuizContent.find({ isPublic: true }, { _id: 1 });
      const userTotalContent = await QuizContent.find(
        { _user: _id },
        { _id: 1, isPublic: 1 }
      );
      const userPublicContent = userTotalContent.filter(
        content => content.isPublic
      );
      const currentUserRound = await QuizRound.find({ _user: _id });

      let roundCompletedQuestions = 0;
      let totalRoundQuestions = 0;
      if (currentUserRound.length > 0) {
        roundCompletedQuestions = currentUserRound[0].round.filter(
          round => round.read
        ).length;
        totalRoundQuestions = currentUserRound[0].round.length;
      }

      return res.send({
        totalQuestions: {
          all: allContent.length,
          you: {
            all: userTotalContent.length,
            public: userPublicContent.length,
            roundCompletedQuestions,
            totalRoundQuestions
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/api/update_quiz', requireLogin, async (req, res) => {
    try {
      const { _id } = req.user;
      const {
        quiz: { title, contents, isPublic, groupId, updatedItems }
      } = req.body;

      const incorrectPayload = contents.some(content => {
        const { question, answer } = content;

        return (
          !question ||
          !answer ||
          answer.length > MAX_ANSWER_LENGTH ||
          question.length > MAX_QUESTION_LENGTH
        );
      });

      if (incorrectPayload) {
        return res.send({
          type: MessageTypeEnum.error,
          message: 'An error occured!'
        });
      }

      await QuizGroup.updateOne(
        { _id: groupId },
        {
          $set: {
            title,
            isPublic,
            lastEditedDate: new Date()
          }
        }
      );

      if (updatedItems[EDIT_DELETE_CONTENT].length > 0) {
        updatedItems[EDIT_DELETE_CONTENT].forEach(async deleteId => {
          await QuizContent.deleteOne({ _id: deleteId });
        });
      }

      if (updatedItems[EDIT_UPDATE_CONTENT].length > 0) {
        updatedItems[EDIT_UPDATE_CONTENT].forEach(async editId => {
          const updateContent = contents.filter(
            content => content._id === editId
          );

          if (updateContent.length > 0) {
            const { question, answer } = updateContent[0];

            await QuizContent.updateOne(
              { _id: editId },
              { $set: { question, answer } }
            );
          }
        });
      }

      if (contents.some(content => !content._id)) {
        const newContent = contents.filter(content => !content._id);

        newContent.forEach(content => {
          new QuizContent({
            question: content.question,
            answer: content.answer,
            isPublic,
            _user: _id,
            _quizGroup: groupId
          }).save();
        });
      }

      if (!isPublic) {
        await QuizContent.updateMany(
          { _quizGroup: groupId },
          { $set: { isPublic: false } }
        );
      } else {
        await QuizContent.updateMany(
          { _quizGroup: groupId },
          { $set: { isPublic: true } }
        );
      }
      await QuizRound.updateMany({}, { $set: { requiresUpdate: true } });

      return res.send({
        type: MessageTypeEnum.success,
        message: 'Quiz updated!'
      });
    } catch (err) {
      console.log(err);
      res.send({
        type: MessageTypeEnum.error,
        message: 'An error occured!'
      });
    }
  });

  app.delete('/api/delete_quiz', requireLogin, async (req, res) => {
    try {
      const { groupId } = req.body;

      const allQuizRounds = await QuizRound.find();
      if (allQuizRounds.length > 0) {
        await QuizRound.updateMany(
          {},
          { $pull: { round: { _quizGroup: groupId } } }
        );
      }

      await QuizContent.deleteMany({ _quizGroup: groupId });
      await QuizGroup.deleteOne({ _id: groupId });

      return res.send({
        type: MessageTypeEnum.success,
        message: 'Quiz deleted!'
      });
    } catch (err) {
      console.log(err);
      return res.send({
        type: MessageTypeEnum.error,
        message: 'Something went wrong...'
      });
    }
  });

  app.get('/api/get_started_quiz_rounds', requireLogin, async (req, res) => {
    try {
      const { _id } = req.user;
      const { selection, batch } = req.query;

      let startedRound = [];
      let selectedQuizContent = [];
      const allGroupCreators = {};
      let searchCondition;

      const firstPass = batch === FIRST_PART;
      const lastPass = batch === LAST_PART;

      switch (selection) {
        case CONTINUE_QUIZ:
        case DEFAULT_QUIZ:
          startedRound = await QuizRound.find({ _user: _id }).lean();
          searchCondition = { isPublic: true };
          break;
        case ALL_PUBLIC_QUIZ:
          if (firstPass) await QuizRound.deleteOne({ _user: _id });
          searchCondition = { isPublic: true };
          break;
        case ALL_OWN_QUIZ:
          if (firstPass) await QuizRound.deleteOne({ _user: _id });
          searchCondition = { _user: _id };
          break;
        default:
          if (firstPass) await QuizRound.deleteOne({ _user: _id });
          searchCondition = { _quizGroup: selection };
          break;
      }

      const allUsers = await Users.find({}, { givenName: 1, familyName: 1 });
      const allGroups = await QuizGroup.find({}, { _user: 1 });

      allGroups.forEach(group => {
        if (!allGroupCreators[group._id])
          allGroupCreators[group._id] = group._user;
      });

      const getUserName = id =>
        allUsers
          .filter(user => user._id.toString() === id.toString())
          .map(user => user.givenName);

      // No round has been started
      if (startedRound.length === 0) {
        const totalDocumentCount = await QuizContent.countDocuments(
          searchCondition
        );

        if (lastPass && INITIAL_BATCH_SIZE > totalDocumentCount) {
          return res.send({ startedRound: [], totalRoundQuestions: 0, batch });
        }

        selectedQuizContent = await QuizContent.find(searchCondition, {
          _id: 1,
          _quizGroup: 1
        })
          .sort({ _id: 1 })
          .lean();

        if (firstPass) {
          await new QuizRound({
            round: selectedQuizContent,
            _user: _id
          }).save();
        }

        const slicedQuizContent = firstPass
          ? selectedQuizContent.slice(0, INITIAL_BATCH_SIZE)
          : selectedQuizContent.slice(INITIAL_BATCH_SIZE);

        const formattedRound = await Promise.all(
          slicedQuizContent.map(async el => ({
            _id: el._id,
            name: getUserName(allGroupCreators[el._quizGroup])[0],
            content: await QuizContent.findOne(
              { _id: el._id },
              { question: 1, answer: 1, _id: 0 }
            )
          }))
        );

        return res.send({
          startedRound: formattedRound,
          totalRoundQuestions: totalDocumentCount,
          batch
        });
      } else {
        const { round, requiresUpdate } = startedRound[0];

        if (round) {
          let currentQuestion = 1;
          let allPublicIdArray = [];
          let combinedContent = [];
          let updatedQuizContent = [];
          let totalDocumentCount = round.length;

          if (lastPass && INITIAL_BATCH_SIZE > totalDocumentCount) {
            return res.send({
              startedRound: [],
              totalRoundQuestions: totalDocumentCount,
              batch
            });
          }

          if (requiresUpdate && firstPass) {
            allPublicIdArray = await QuizContent.find(
              { isPublic: true },
              {
                _id: 1,
                _quizGroup: 1
              }
            )
              .sort({ _id: 1 })
              .lean();

            const mappedPublicIdArray = allPublicIdArray.map(({ _id }) =>
              _id.toString()
            );
            const updatedRoundContent = round.filter(content =>
              mappedPublicIdArray.includes(content._id.toString())
            );
            const updatedRoundContentIds = updatedRoundContent.map(({ _id }) =>
              _id.toString()
            );

            const missingContent = allPublicIdArray
              .filter(el => !updatedRoundContentIds.includes(el._id.toString()))
              .map(content => ({
                ...content,
                read: false
              }));

            combinedContent = [...updatedRoundContent, ...missingContent];

            currentQuestion =
              updatedRoundContent.filter(content => content.read).length + 1;
            totalDocumentCount = combinedContent.length;

            await QuizRound.updateOne(
              { _user: _id },
              { $set: { round: combinedContent, requiresUpdate: false } }
            );

            updatedQuizContent = combinedContent.filter(
              content => !content.read
            );
          } else {
            currentQuestion = round.filter(content => content.read).length + 1;
            updatedQuizContent = round.filter(content => !content.read);
          }

          const slicedQuizContent = firstPass
            ? updatedQuizContent.slice(0, INITIAL_BATCH_SIZE)
            : updatedQuizContent.slice(INITIAL_BATCH_SIZE);

          const formattedRound = await Promise.all(
            slicedQuizContent.map(async cc => ({
              _id: cc._id,
              name: getUserName(allGroupCreators[cc._quizGroup])[0],
              read: cc.read,
              content: await QuizContent.findOne(
                { _id: cc._id },
                { question: 1, answer: 1, _id: 0 }
              )
            }))
          );

          return res.send({
            startedRound: formattedRound,
            totalRoundQuestions: totalDocumentCount,
            currentQuestion,
            batch
          });
        }

        return res.send({ startedRound: [], totalRoundQuestions: 0, batch });
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/api/update_question_read', requireLogin, async (req, res) => {
    try {
      const { readId, questionsLeft, batch } = req.body;
      const { _id } = req.user;

      const firstPass = batch === FIRST_PART;
      const lastPass = batch === LAST_PART;

      if (questionsLeft === 0) {
        const allGroupCreators = {};
        const allUsers = await Users.find({}, { givenName: 1, familyName: 1 });
        const allGroups = await QuizGroup.find({}, { _user: 1 });
        const currentRound = await QuizRound.findOne({ _user: _id }).lean();

        allGroups.forEach(group => {
          if (!allGroupCreators[group._id])
            allGroupCreators[group._id] = group._user;
        });

        const getUserName = id =>
          allUsers
            .filter(user => user._id.toString() === id.toString())
            .map(user => user.givenName);

        if (currentRound && currentRound.round) {
          const reflaggedRound = currentRound.round.map(content => ({
            ...content,
            read: false
          }));

          if (firstPass) {
            await QuizRound.updateOne(
              { _user: _id },
              { $set: { round: reflaggedRound } }
            );
          } else if (lastPass && reflaggedRound.length <= INITIAL_BATCH_SIZE) {
            return res.send({ newRound: [], batch });
          }

          const slicedReflaggedRound = firstPass
            ? reflaggedRound.slice(0, INITIAL_BATCH_SIZE)
            : reflaggedRound.slice(INITIAL_BATCH_SIZE);

          const formattedRound = await Promise.all(
            slicedReflaggedRound.map(async cc => ({
              _id: cc._id,
              name: getUserName(allGroupCreators[cc._quizGroup])[0],
              content: await QuizContent.findOne(
                { _id: cc._id },
                { question: 1, answer: 1, _id: 0 }
              )
            }))
          );

          return res.send({ newRound: formattedRound, batch });
        }

        return res.send({ newRound: null });
      } else {
        await QuizRound.updateOne(
          { _user: _id, 'round._id': readId },
          { $set: { 'round.$.read': true } }
        );

        return res.send({ newRound: null });
      }
    } catch (err) {
      console.log(err);
      return res.send({ newRound: null });
    }
  });

  app.post('/api/update_previous_read', requireLogin, async (req, res) => {
    try {
      const { readId } = req.body;
      const { _id } = req.user;

      await QuizRound.updateOne(
        { _user: _id, 'round._id': readId },
        { $set: { 'round.$.read': false } }
      );

      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(503);
    }
  });
};
