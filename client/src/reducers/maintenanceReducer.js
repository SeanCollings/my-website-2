import { ADD_PERERITTO_USER } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case ADD_PERERITTO_USER:
      return action.payload || false;
    default:
      return state;
  }
}
