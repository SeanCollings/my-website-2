import {
  GET_SAVED_QUIZZES,
  GET_STARTED_QUIZ_ROUNDS,
  GET_TOTAL_QUESTIONS,
  UPDATED_QUESTION
} from '../actions/types';
import { FIRST_PART, LAST_PART } from '../utils/constants';

const initialState = {
  savedQuizzes: [],
  startedRound: null,
  totalRoundQuestions: 0,
  totalQuestions: {
    all: 0,
    you: {
      all: 0,
      public: 0,
      roundCompletedQuestions: 0,
      totalRoundQuestions: 0
    }
  },
  updatedQuestions: null,
  currentQuestion: 1
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SAVED_QUIZZES:
      return { ...state, savedQuizzes: action.payload };
    case GET_STARTED_QUIZ_ROUNDS:
      const {
        startedRound,
        totalRoundQuestions,
        currentQuestion,
        batch
      } = action.payload;

      if (batch === FIRST_PART) {
        return {
          ...state,
          startedRound,
          totalRoundQuestions,
          currentQuestion
        };
      } else if (batch === LAST_PART) {
        return {
          ...state,
          startedRound: state.startedRound
            ? [...state.startedRound, ...startedRound]
            : [...startedRound]
        };
      } else {
        return { ...state };
      }
    case GET_TOTAL_QUESTIONS:
      const { totalQuestions } = action.payload;
      return { ...state, totalQuestions };
    case UPDATED_QUESTION:
      const { newRound, batch: updatedBatch } = action.payload;

      if (updatedBatch === FIRST_PART) {
        return { ...state, updatedQuestions: newRound };
      } else if (updatedBatch === LAST_PART) {
        return {
          ...state,
          updatedQuestions: state.updatedQuestions
            ? [...state.updatedQuestions, ...newRound]
            : [...newRound]
        };
      }

      return { ...state, updatedQuestions: newRound };
    default:
      return state;
  }
}
