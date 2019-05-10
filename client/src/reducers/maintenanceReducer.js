import { FETCH_All_USERS } from '../actions/types';

const intialState = {
  users: []
};

export default function(state = intialState, action) {
  switch (action.type) {
    case FETCH_All_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
}
