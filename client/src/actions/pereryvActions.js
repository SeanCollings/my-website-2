import axios from '../utils/axios';
import { readAllData } from '../utils/utility';
import {
  GET_PERERYV_USERS,
  GET_SLATES,
  SHOW_MESSAGE,
  GET_COMPLETED_SLATES
} from './types';

export const getSlates = () => async dispatch => {
  axios.get(`/api/get_slates`).then(res => {
    dispatch({ type: GET_SLATES, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('slates').then(data => {
      dispatch({ type: GET_SLATES, payload: data });
    });
  }
};

export const getPereryvUsers = () => async dispatch => {
  const res = await axios.get(`/api/get_pereryv_users`);

  dispatch({ type: GET_PERERYV_USERS, payload: res.data });

  // if ('indexedDB' in window) {
  //   readAllData('pereryv-users').then(data => {
  //     dispatch({ type: GET_PERERITTO_USERS, payload: data });
  //   });
  // }
};

export const createSlate = slateName => async dispatch => {
  const res = await axios.post(`/api/create_slate`, {
    slateName
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const updateSlate = (slateId, slateName, userIds) => async dispatch => {
  const res = await axios.post(`/api/update_slate`, {
    slateId,
    slateName,
    userIds
  });

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const getCompletedSlates = () => async dispatch => {
  axios.get(`/api/get_completed_slates`).then(res => {
    dispatch({ type: GET_COMPLETED_SLATES, payload: res.data });
  });

  if ('indexedDB' in window) {
    readAllData('completed-slates').then(data => {
      dispatch({ type: GET_COMPLETED_SLATES, payload: data[0].data });
    });
  }
};
