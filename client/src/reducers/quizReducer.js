import {
  GET_SAVED_QUIZZES,
  GET_STARTED_QUIZ_ROUNDS,
  GET_TOTAL_QUESTIONS,
  UPDATED_QUESTION
} from '../actions/types';

const initialState = {
  savedQuizzes: [],
  startedRound: null,
  totalQuestions: { all: 0, you: { all: 0, public: 0 } },
  updatedQuestions: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SAVED_QUIZZES:
      return { ...state, savedQuizzes: action.payload };
    case GET_STARTED_QUIZ_ROUNDS:
      const { startedRound } = action.payload;
      return { ...state, startedRound };
    case GET_TOTAL_QUESTIONS:
      const { totalQuestions } = action.payload;
      return { ...state, totalQuestions };
    case UPDATED_QUESTION:
      const { newRound } = action.payload;
      return { ...state, updatedQuestions: newRound };
    default:
      return state;
  }
}
