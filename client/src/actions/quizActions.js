import axios from '../utils/axios';
import { readAllData } from '../utils/utility';
import {
  GET_SAVED_QUIZZES,
  GET_STARTED_QUIZ_ROUNDS,
  SHOW_MESSAGE,
  GET_TOTAL_QUESTIONS,
  UPDATED_QUESTION,
  PREVIOUS_QUESTION
} from './types';
import { FIRST_PART, LAST_PART } from '../utils/constants';

export const saveQuiz = quiz => async dispatch => {
  const res = await axios.post(`/api/save_quiz`, {
    quiz
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const updateQuiz = quiz => async dispatch => {
  const res = await axios.post(`/api/update_quiz`, {
    quiz
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getSavedQuizzes = () => async dispatch => {
  axios.get(`/api/get_saved_quizzes`).then(res => {
    dispatch({ type: GET_SAVED_QUIZZES, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('saved-quizzes').then(data => {
      dispatch({ type: GET_SAVED_QUIZZES, payload: data });
    });
  }
};

export const getStartedQuizRounds = selection => async dispatch => {
  const resFirst = await axios.get(
    `/api/get_started_quiz_rounds?selection=${selection}&batch=${FIRST_PART}`
  );
  dispatch({ type: GET_STARTED_QUIZ_ROUNDS, payload: resFirst.data });

  const resLast = await axios.get(
    `/api/get_started_quiz_rounds?selection=${selection}&batch=${LAST_PART}`
  );

  dispatch({ type: GET_STARTED_QUIZ_ROUNDS, payload: resLast.data });
};

export const resetQuizRound = () => dispatch => {
  dispatch({
    type: GET_STARTED_QUIZ_ROUNDS,
    payload: { startedRound: null, batch: FIRST_PART }
  });
};

export const getTotalQuestions = () => async dispatch => {
  axios.get('/api/get_total_questions').then(res => {
    dispatch({ type: GET_TOTAL_QUESTIONS, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('total-questions').then(data => {
      let udpatedData = data;

      if (!data.length) {
        udpatedData = [
          {
            totalQuestions: {
              all: 0,
              you: {
                all: 0,
                public: 0,
                roundCompletedQuestions: 0,
                totalRoundQuestions: 0
              }
            }
          }
        ];
      }

      dispatch({ type: GET_TOTAL_QUESTIONS, payload: udpatedData[0] });
    });
  }
};

export const deleteQuiz = groupId => async dispatch => {
  const res = await axios.delete('/api/delete_quiz', {
    data: { groupId }
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const updateQuestionRead = (readId, questionsLeft) => async dispatch => {
  const resFirst = await axios.post('/api/update_question_read', {
    readId,
    questionsLeft,
    batch: FIRST_PART
  });
  dispatch({ type: UPDATED_QUESTION, payload: resFirst.data });

  if (resFirst.data.newRound) {
    const resLast = await axios.post('/api/update_question_read', {
      readId,
      questionsLeft,
      batch: LAST_PART
    });
    dispatch({ type: UPDATED_QUESTION, payload: resLast.data });
  }
};

export const updatePreviousQuestion = readId => async dispatch => {
  await axios.post('/api/update_previous_read', {
    readId
  });

  dispatch({ type: PREVIOUS_QUESTION });
};
