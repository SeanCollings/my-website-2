import { GET_USER_AWARDS, GET_USER_AWARDS_TOTAL } from '../actions/types';

const initialState = {
  allAwards: null,
  userTotal: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USER_AWARDS:
      return { ...state, allAwards: action.payload.allAwards };
    case GET_USER_AWARDS_TOTAL:
      return { ...state, userTotal: action.payload };
    default:
      return state;
  }
}
