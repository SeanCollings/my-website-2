import axios from '../utils/axios';
import {
  FETCH_USER,
  VERIFY_USER,
  GET_PERERITTO_USERS,
  FETCH_All_USERS,
  SHOW_MESSAGE,
  GET_WINNERS,
  GET_USER_SETTINGS,
  GET_WINNER_YEARS,
  CLEAR_WINNERS,
  GET_USER_AWARDS,
  UPDATE_SUBSCRIPTIONS,
  SET_SUBSCRIPTION_NULL,
  TEST_NOTIFICATION,
  GET_NOTIFICATION_GROUPS
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchAllUsers = parameters => async dispatch => {
  let params = '';
  if (parameters) {
    parameters.map((parameter, index) => {
      if (index > 0) return (params += `&param${index + 1}=${parameter}`);

      return (params += `param${index + 1}=${parameter}`);
    });
  }

  const res = await axios.get(`/api/get_users?${params}`);

  dispatch({ type: FETCH_All_USERS, payload: res.data });
};

export const updateUser = attributes => async dispatch => {
  const res = await axios.post('/api/update_user', {
    id: attributes.id,
    body: attributes.body
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const userAllowsNotifications = () => async dispatch => {
  const res = await axios.get('/api/allow_notifications', {});

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const verifyUser = route => async dispatch => {
  const res = await axios.get(`/api/${route}`);

  dispatch({ type: VERIFY_USER, payload: res.data });
};

export const getPererittoUsers = () => async dispatch => {
  const res = await axios.get(`/api/get_pereritto`);

  dispatch({ type: GET_PERERITTO_USERS, payload: res.data });
};

export const addPererittoUser = (
  _id,
  name,
  colour,
  _pereritto
) => async dispatch => {
  colour = colour.substring(1);

  const res = await axios.post('/api/add_pereritto', {
    _id,
    name,
    colour,
    _pereritto
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const updatePererittoUser = (name, date) => async dispatch => {
  const res = await axios.post('/api/update_pereritto', {
    name,
    date
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const deletePererittoUser = (_id, _pereritto) => async dispatch => {
  const res = await axios.delete('/api/delete_pereritto', {
    data: { _id, _pereritto }
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getWinners = year => async dispatch => {
  const res = await axios.get(`/api/get_winners?year=${year}`);

  let payload = { data: res.data, year: null };

  if (payload.data && payload.data.length > 0 && payload.data[0].year)
    payload = { ...payload, year: payload.data[0].year };

  dispatch({ type: GET_WINNERS, payload });

  // May Potentially break everything?
  // dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getWinnerYears = () => async dispatch => {
  const res = await axios.get(`/api/get_winneryears`);

  dispatch({ type: GET_WINNER_YEARS, payload: res.data });
};

export const clearWinners = () => {
  return { type: CLEAR_WINNERS };
};

export const getUserSettings = () => async dispatch => {
  const res = await axios.get(`/api/get_usersettings`);

  dispatch({ type: GET_USER_SETTINGS, payload: res.data });
};

export const updateProfilePic = option => async dispatch => {
  const res = await axios.post('/api/update_profilepic', {
    option
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const uploadUserPhoto = dataUri => async dispatch => {
  const res = await axios.post('/api/upload_userphoto', {
    dataUri
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const removeUserPhoto = () => async dispatch => {
  const res = await axios.delete('/api/delete_userphoto', {
    data: {}
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getUserAwards = () => async dispatch => {
  const res = await axios.get(`/api/get_userawards`);

  dispatch({ type: GET_USER_AWARDS, payload: res.data });
};

export const updateSubscriptions = newSub => async dispatch => {
  const res = await axios.post('/api/update_subscriptions', {
    newSub
  });

  dispatch({ type: UPDATE_SUBSCRIPTIONS, payload: res.data });
};

export const setSubscriptionNull = () => dispatch => {
  dispatch({ type: SET_SUBSCRIPTION_NULL });
};

export const testNotification = () => async dispatch => {
  await axios.post('/api/test_notification', {});

  dispatch({ type: TEST_NOTIFICATION });
};

export const getNotificationGroups = () => async dispatch => {
  const res = await axios.get('/api/get_notificationgroups');

  dispatch({ type: GET_NOTIFICATION_GROUPS, payload: res.data });
};
