import { GET_PERERITTO_USERS } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case GET_PERERITTO_USERS:
      return action.payload || false;
    default:
      return state;
  }
}
