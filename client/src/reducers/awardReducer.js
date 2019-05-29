import { GET_USER_AWARDS } from '../actions/types';

const initialState = {
  allAwards: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USER_AWARDS:
      return action.payload;
    default:
      return state;
  }
}
