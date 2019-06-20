import { GET_LOCATION_GROUPS, GET_PUSHER_CREDS } from '../actions/types';

const intialState = {
  groups: null,
  pusherCreds: null
};

export default function(state = intialState, action) {
  switch (action.type) {
    case GET_LOCATION_GROUPS:
      return { ...state, groups: action.payload };
    case GET_PUSHER_CREDS:
      return { ...state, pusherCreds: action.payload };
    default:
      return state;
  }
}
