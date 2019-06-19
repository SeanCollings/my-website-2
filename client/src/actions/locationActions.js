import axios from '../utils/axios';

import { GET_LOCATION_GROUPS, SHOW_MESSAGE } from './types';

export const getLocationGroups = () => async dispatch => {
  axios.get('/api/get_locationgroups').then(res => {
    dispatch({ type: GET_LOCATION_GROUPS, payload: res.data });
  });

  // if ('indexedDB' in window) {
  //   readAllData('notification-groups').then(data => {
  //     dispatch({ type: GET_LOCATION_GROUPS, payload: data });
  //   });
  // }
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
