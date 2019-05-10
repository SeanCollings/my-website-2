import axios from 'axios';
import {
  FETCH_USER,
  VERIFY_USER,
  GET_PERERITTO_USERS,
  DELETE_PERERITTO_USER,
  FETCH_All_USERS,
  UPDATE_PERERITTO_USER,
  SHOW_MESSAGE
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchAllUsers = () => async dispatch => {
  const res = await axios.get('/api/get_users');

  dispatch({ type: FETCH_All_USERS, payload: res.data });
};

export const verifyUser = route => async dispatch => {
  const res = await axios.get(`/api/${route}`);

  dispatch({ type: VERIFY_USER, payload: res.data });
};

export const getPererittoUsers = () => async dispatch => {
  const res = await axios.get(`/api/get_pereritto`);

  dispatch({ type: GET_PERERITTO_USERS, payload: res.data });
};

export const addPererittoUser = (name, colour) => async dispatch => {
  const res = await axios.get(
    `/api/add_pereritto?name=${name}&colour=${colour.substring(1)}`
  );

  dispatch({ type: SHOW_MESSAGE, payload: res.data });
};

export const updatePererittoUser = (name, checked) => async dispatch => {
  checked = checked ? 1 : 0;

  const res = await axios.get(
    `/api/update_pereritto?name=${name}&checked=${checked}`
  );

  dispatch({ type: UPDATE_PERERITTO_USER, payload: res.data });
};

export const deletePererittoUser = name => async dispatch => {
  const res = await axios.get(`/api/delete_pereritto?name=${name}`);

  dispatch({ type: DELETE_PERERITTO_USER, payload: res.data });
};
