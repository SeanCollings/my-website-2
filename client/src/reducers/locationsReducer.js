import {
  GET_LOCATION_GROUPS,
  GET_PUSHER_CREDS,
  SET_PUSHER,
  SET_GEO_ID,
  ONLINE_MEMBERS_LOCATIONS,
  TOTAL_ONLINE,
  LOCATIONS_INITIALISED,
  SET_RANDOM_USERNAME,
  LAST_KNOWN_LOCATION,
  ONLINE_MEMBERS_UPDATED,
  LOCATIONS_STARTED
} from '../actions/types';

const intialState = {
  groups: null,
  pusherCreds: null,
  geoId: null,
  pusher: null,
  onlineMembers: null,
  totalOnline: 0,
  initialised: false,
  random: null,
  lastKnownLocation: null,
  onlineMembersUpdated: false,
  locationsStarted: false
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
      return { ...state, onlineMembers: action.payload };
    case TOTAL_ONLINE:
      return { ...state, totalOnline: action.payload };
    case LOCATIONS_INITIALISED:
      return { ...state, initialised: action.payload };
    case SET_RANDOM_USERNAME:
      return { ...state, random: action.payload };
    case LAST_KNOWN_LOCATION:
      return { ...state, lastKnownLocation: action.payload };
    case ONLINE_MEMBERS_UPDATED:
      return { ...state, onlineMembersUpdated: action.payload };
    case LOCATIONS_STARTED:
      return { ...state, locationsStarted: action.payload };
    default:
      return state;
  }
}
