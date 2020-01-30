import {
  GET_SAVED_QUIZZES,
  GET_STARTED_QUIZ_ROUNDS,
  GET_TOTAL_QUESTIONS
} from '../actions/types';

const initialState = {
  savedQuizzes: [],
  startedRound: null,
  totalQuestions: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SAVED_QUIZZES:
      return { ...state, savedQuizzes: action.payload };
    case GET_STARTED_QUIZ_ROUNDS:
      return { ...state, startedRound: action.payload };
    case GET_TOTAL_QUESTIONS:
      const { totalQuestions } = action.payload;
      return { ...state, totalQuestions };
    default:
      return state;
  }
}
