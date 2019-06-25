import axios from '../utils/axios';
import { MessageTypeEnum } from '../utils/constants';
import { readAllData } from '../utils/utility';
import {
  GET_LOCATION_GROUPS,
  SHOW_MESSAGE,
  GET_PUSHER_CREDS,
  SET_PUSHER,
  SET_GEO_ID,
  ONLINE_MEMBERS_LOCATIONS,
  TOTAL_ONLINE,
  LOCATIONS_INITIALISED,
  SET_RANDOM_USERNAME,
  LAST_KNOWN_LOCATION
} from './types';

export const getLocationGroups = () => async dispatch => {
  axios.get('/api/get_locationgroups').then(res => {
    dispatch({ type: GET_LOCATION_GROUPS, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('location-groups').then(data => {
      dispatch({ type: GET_LOCATION_GROUPS, payload: data });
    });
  }
};

export const createLocationGroups = (
  name,
  icon,
  location,
  groupMembers
) => async dispatch => {
  const res = await axios.post('/api/add_locationgroup', {
    name,
    icon,
    location,
    groupMembers
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const updateLocationGroups = (
  _id,
  name,
  icon,
  location,
  groupMembers
) => async dispatch => {
  const res = await axios.post('/api/update_locationgroup', {
    _id,
    name,
    icon,
    location,
    groupMembers
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const deleteGroup = (_id, name) => async dispatch => {
  const res = await axios.delete('/api/delete_locationgroup', {
    data: { _id, name }
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getPusherCreds = () => async dispatch => {
  const res = await axios.get('/api/get_pushercreds');

  dispatch({ type: GET_PUSHER_CREDS, payload: res.data });
};

export const setPusher = pusher => dispatch => {
  dispatch({ type: SET_PUSHER, payload: pusher });
};

export const setGeoId = geoId => dispatch => {
  dispatch({ type: SET_GEO_ID, payload: geoId });
};

export const onlineMembersLocations = members => dispatch => {
  dispatch({ type: ONLINE_MEMBERS_LOCATIONS, payload: members });
};

export const totalOnline = total => dispatch => {
  dispatch({ type: TOTAL_ONLINE, payload: total });
};

export const locationsInitialised = init => dispatch => {
  dispatch({ type: LOCATIONS_INITIALISED, payload: init });
};

export const setRandomUserName = random => dispatch => {
  dispatch({ type: SET_RANDOM_USERNAME, payload: random });
};

export const lastKnownLocation = location => dispatch => {
  dispatch({ type: LAST_KNOWN_LOCATION, payload: location });
};

export const newMemberOnline = username => dispatch => {
  dispatch({
    type: SHOW_MESSAGE,
    payload: { type: MessageTypeEnum.info, message: `${username} is online` }
  });
};

export const memberGoneOffline = username => dispatch => {
  dispatch({
    type: SHOW_MESSAGE,
    payload: { type: MessageTypeEnum.info, message: `${username} has left` }
  });
};
