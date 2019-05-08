import axios from 'axios';
import {
  FETCH_USER,
  VERIFY_USER,
  GET_PERERITTO_USERS,
  ADD_PERERITTO_USER
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const verifyUser = route => async dispatch => {
  console.log('action created with', route);

  const res = await axios.get(`/api/${route}`);

  console.log(res);
  dispatch({ type: VERIFY_USER, payload: res.data });
};

export const getPererittoUsers = () => async dispatch => {
  const res = await axios.get(`/api/get_pereritto`);

  dispatch({ type: GET_PERERITTO_USERS, payload: res.data });
};

export const addPererittoUser = (name, colour) => async dispatch => {
  console.log(colour);
  const res = await axios.get(
    `/api/add_pereritto?name=${name}&colour=${colour}`
  );

  dispatch({ type: ADD_PERERITTO_USER, payload: res.data });
};
