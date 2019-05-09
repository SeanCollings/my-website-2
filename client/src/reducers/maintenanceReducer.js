import {
  ADD_PERERITTO_USER,
  DELETE_PERERITTO_USER,
  FETCH_All_USERS
} from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case ADD_PERERITTO_USER:
      return action.payload || false;
    case DELETE_PERERITTO_USER:
      return action.payload || false;
    case FETCH_All_USERS:
      return action.payload;
    default:
      return state;
  }
}
