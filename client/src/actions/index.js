import axios from '../utils/axios';
import { MessageTypeEnum } from '../utils/constants';
import { readAllData } from '../utils/utility';
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
  GET_SPLASHES,
  GET_NOTIFICATION_GROUPS,
  GET_GROUP_MEMBERS
} from './types';

export const fetchUser = () => dispatch => {
  axios.get('/api/current_user').then(res => {
    dispatch({ type: FETCH_USER, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('current-user').then(data => {
      if (data) dispatch({ type: FETCH_USER, payload: data[0] });
    });
  }
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

export const verifyUser = route => async dispatch => {
  const res = await axios.get(`/api/${route}`);

  dispatch({ type: VERIFY_USER, payload: res.data });
};

export const getPererittoUsers = () => async dispatch => {
  axios.get(`/api/get_pereritto`).then(res => {
    dispatch({ type: GET_PERERITTO_USERS, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('pereritto-players').then(data => {
      dispatch({ type: GET_PERERITTO_USERS, payload: data });
    });
  }
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

export const updatePererittoUser = (
  id,
  date,
  presentPlayers
) => async dispatch => {
  const res = await axios.post('/api/update_pereritto', {
    id,
    date,
    presentPlayers
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const deletePererittoUser = (_id, _pereritto) => async dispatch => {
  const res = await axios.delete('/api/delete_pereritto', {
    data: { _id, _pereritto }
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const retirePlayer = (_id, _pereritto) => async dispatch => {
  const res = await axios.post('/api/retire_pereritto', {
    _id,
    _pereritto
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const returnPlayer = (_id, _pereritto) => async dispatch => {
  const res = await axios.post('/api/return_pereritto', {
    _id,
    _pereritto
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getWinners = year => async dispatch => {
  axios.get('/api/get_winners').then(res => {
    dispatch({ type: GET_WINNERS, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('winners').then(data => {
      dispatch({ type: GET_WINNERS, payload: data });
    });
  }

  // May Potentially break everything?
  // dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getWinnerYears = () => async dispatch => {
  axios.get(`/api/get_winneryears`).then(res => {
    dispatch({ type: GET_WINNER_YEARS, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('winner-years').then(data => {
      if (data && data.length > 0)
        dispatch({ type: GET_WINNER_YEARS, payload: data[0].data });
    });
  }
};

export const removeWinnerDate = date => async dispatch => {
  const res = await axios.delete('/api/delete_winner_date', {
    data: { date }
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const markPlayerAbsent = (id, date) => async dispatch => {
  const res = await axios.post('/api/mark_player_absent', {
    id,
    date
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const clearWinners = () => {
  return { type: CLEAR_WINNERS };
};

export const getUserSettings = () => async dispatch => {
  axios.get(`/api/get_usersettings`).then(res => {
    dispatch({ type: GET_USER_SETTINGS, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('user-settings').then(data => {
      if (data) dispatch({ type: GET_USER_SETTINGS, payload: data[0] });
    });
  }
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

export const userAllowsNotifications = () => async dispatch => {
  const res = await axios.get('/api/allow_notifications', {});

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const disableNotifications = showConfirmationMessage => async dispatch => {
  const res = await axios.post('/api/disable_notifications', {
    showConfirmationMessage
  });

  if (res.data.type !== MessageTypeEnum.none) {
    dispatch({ type: SHOW_MESSAGE, payload: res.data });
  }
};

export const getSplashes = () => async dispatch => {
  const res = await axios.get('/api/get_splashes');

  dispatch({ type: GET_SPLASHES, payload: res.data });
};

export const sendSplashNotification = groupId => async dispatch => {
  const res = await axios.post('/api/send_splash', { groupId });

  dispatch({ type: GET_SPLASHES, payload: res.data });
};

export const getNotificationGroups = () => async dispatch => {
  axios.get('/api/get_notificationgroups').then(res => {
    dispatch({ type: GET_NOTIFICATION_GROUPS, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('notification-groups').then(data => {
      dispatch({ type: GET_NOTIFICATION_GROUPS, payload: data });
    });
  }
};

export const createNotificationGroup = (
  name,
  icon,
  groupMembers
) => async dispatch => {
  const res = await axios.post('/api/add_notificationgroup', {
    name,
    icon,
    groupMembers
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const updateNotificationGroup = (
  _id,
  name,
  icon,
  groupMembers,
  createdById
) => async dispatch => {
  const res = await axios.post('/api/update_notificationgroup', {
    _id,
    name,
    icon,
    groupMembers,
    createdById
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const createNonSuperUserNotificationGroup = (
  name,
  icon,
  groupMembers
) => async dispatch => {
  const res = await axios.post('/api/add_nsu_notificationgroup', {
    name,
    icon,
    groupMembers
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const updateNonSuperUserNotificationGroup = (
  _id,
  name,
  icon,
  // emailAddress,
  createdById
) => async dispatch => {
  const res = await axios.post('/api/update_nsu_notificationgroup', {
    _id,
    name,
    icon,
    // emailAddress,
    createdById
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const deleteNotificationGroup = (
  createdById,
  groupId,
  name
) => async dispatch => {
  const res = await axios.delete('/api/delete_notificationgroup', {
    data: { createdById, groupId, name }
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getGroupMembers = groupId => async dispatch => {
  const res = await axios.get(`/api/get_groupmembers?groupid=${groupId}`);

  dispatch({ type: GET_GROUP_MEMBERS, payload: res.data });
};
