import requireLogin from '../middlewares/requireLogin';
import {
  MessageTypeEnum,
  MAX_ANSWER_LENGTH,
  MAX_QUESTION_LENGTH
} from '../client/src/utils/constants';

const mongoose = require('mongoose');
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
      const content = await QuizContent.find({ isPublic: true }, { _id: 1 });

      return res.send({ totalQuestions: content.length });
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/api/update_quiz', requireLogin, async (req, res) => {
    try {
      const {
        quiz: { title, contents, isPublic, groupId }
      } = req.body;
      const { _id } = req.user;

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

      await QuizContent.deleteMany({ _quizGroup: groupId });

      await contents.forEach(content => {
        new QuizContent({
          question: content.question,
          answer: content.answer,
          isPublic,
          _user: _id,
          _quizGroup: groupId
        }).save();
      });

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
};
