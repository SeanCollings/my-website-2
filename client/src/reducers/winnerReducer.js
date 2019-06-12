import { GET_WINNERS, GET_WINNER_YEARS, CLEAR_WINNERS } from '../actions/types';

const intialState = {
  winners: null,
  winnerYears: null,
  selectedYears: []
};

export default function(state = intialState, action) {
  switch (action.type) {
    case GET_WINNERS:
      return { ...state, winners: action.payload };
    case GET_WINNER_YEARS:
      return { ...state, winnerYears: action.payload };
    case CLEAR_WINNERS:
      return { ...state, winners: null };
    default:
      return state;
  }
}
