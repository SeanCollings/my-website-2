import requireLogin from '../middlewares/requireLogin';
import {
  MessageTypeEnum,
  MAX_ANSWER_LENGTH,
  MAX_QUESTION_LENGTH,
  EDIT_DELETE_CONTENT,
  EDIT_UPDATE_CONTENT
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

      return res.send({
        totalQuestions: {
          all: allContent.length,
          you: {
            all: userTotalContent.length,
            public: userPublicContent.length
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/api/update_quiz', requireLogin, async (req, res) => {
    try {
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
      const allGroupCreators = {};

      const allUsers = await Users.find({}, { givenName: 1, familyName: 1 });
      const allGroups = await QuizGroup.find({}, { _user: 1 });

      const startedRound = await QuizRound.find({ _user: _id }).lean();
      const allPublicContent = await QuizContent.find(
        { isPublic: true },
        { _id: 1, _quizGroup: 1 }
      ).lean();

      allGroups.forEach(group => {
        if (!allGroupCreators[group._id])
          allGroupCreators[group._id] = group._user;
      });

      const getUserName = id =>
        allUsers
          .filter(user => user._id.toString() === id.toString())
          .map(user => user.givenName);

      if (startedRound.length === 0) {
        await new QuizRound({
          round: allPublicContent,
          _user: _id
        }).save();

        const formattedRound = await Promise.all(
          allPublicContent.map(async el => ({
            _id: el._id,
            name: getUserName(allGroupCreators[el._quizGroup])[0],
            content: await QuizContent.findOne(
              { _id: el._id },
              { question: 1, answer: 1, _id: 0 }
            )
          }))
        );

        res.send({ startedRound: formattedRound });
      } else {
        const { round, requiresUpdate } = startedRound[0];

        if (round) {
          const roundIdArray = round.map(r => r._id.toString());
          const allPublicIdArray = allPublicContent.map(c => c._id.toString());
          const commonContent = round.filter(r =>
            allPublicIdArray.includes(r._id.toString())
          );
          const missingContent = allPublicContent
            .filter(c => !roundIdArray.includes(c._id.toString()))
            .map(content => ({ ...content, read: false }));

          const combinedContent = [...commonContent, ...missingContent];

          if (requiresUpdate) {
            await QuizRound.updateOne(
              { _user: _id },
              { $set: { round: combinedContent, requiresUpdate: false } }
            );
          }

          const formattedRound = await Promise.all(
            combinedContent.map(async cc => ({
              _id: cc._id,
              name: getUserName(allGroupCreators[cc._quizGroup])[0],
              read: cc.read,
              content: await QuizContent.findOne(
                { _id: cc._id },
                { question: 1, answer: 1, _id: 0 }
              )
            }))
          );

          const formattedReadRound = formattedRound.filter(cc => !cc.read);

          if (formattedReadRound.length === 0) {
            const reflaggedRound = combinedContent.map(content => ({
              ...content,
              read: false,
              name: null
            }));

            await QuizRound.updateOne(
              { _user: _id },
              { $set: { round: reflaggedRound } }
            );
          }

          return res.send({ startedRound: formattedReadRound });
        }
        return res.send({ startedRound: [] });
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/api/update_question_read', requireLogin, async (req, res) => {
    try {
      const { readId, questionsLeft } = req.body;
      const { _id } = req.user;

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

          await QuizRound.updateOne(
            { _user: _id },
            { $set: { round: reflaggedRound } }
          );

          const formattedRound = await Promise.all(
            reflaggedRound.map(async cc => ({
              _id: cc._id,
              name: getUserName(allGroupCreators[cc._quizGroup])[0],
              content: await QuizContent.findOne(
                { _id: cc._id },
                { question: 1, answer: 1, _id: 0 }
              )
            }))
          );

          return res.send({ newRound: formattedRound });
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
};
