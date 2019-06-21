import {
  GET_LOCATION_GROUPS,
  GET_PUSHER_CREDS,
  SET_PUSHER,
  SET_GEO_ID,
  ONLINE_MEMBERS_LOCATIONS
} from '../actions/types';

const intialState = {
  groups: null,
  pusherCreds: null,
  geoId: null,
  pusher: null,
  onlineMembers: null
};

export default function(state = intialState, action) {
  switch (action.type) {
    case GET_LOCATION_GROUPS:
      return { ...state, groups: action.payload };
    case GET_PUSHER_CREDS:
      return { ...state, pusherCreds: action.payload };
    case SET_PUSHER:
      return { ...state, pusher: action.payload };
    case SET_GEO_ID:
      return { ...state, geoId: action.payload };
    case ONLINE_MEMBERS_LOCATIONS:
      // console.log('Reducer:', action.payload);
      return { ...state, onlineMembers: action.payload };
    default:
      return state;
  }
}
