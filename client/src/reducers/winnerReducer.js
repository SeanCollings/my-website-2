import { GET_WINNERS, GET_WINNER_YEARS, CLEAR_WINNERS } from '../actions/types';

const intialState = {
  winners: null,
  winnerYears: null
};

export default function(state = intialState, action) {
  switch (action.type) {
    case GET_WINNERS:
      if (state.winners)
        return { ...state, winners: [...state.winners, ...action.payload] };

      return { ...state, winners: action.payload };
    case GET_WINNER_YEARS:
      return { ...state, winnerYears: action.payload };
    case CLEAR_WINNERS:
      return { ...state, winners: null };
    default:
      return state;
  }
}
