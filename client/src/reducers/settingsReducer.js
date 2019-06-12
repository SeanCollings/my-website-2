import { GET_USER_SETTINGS } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case GET_USER_SETTINGS:
      if (action.payload)
        return { ...state, profilePic: action.payload.profilePic };
      else return { ...state };
    default:
      return state;
  }
}
