import { GET_USER_SETTINGS } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case GET_USER_SETTINGS:
      return action.payload;
    default:
      return state;
  }
}
