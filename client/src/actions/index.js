import axios from 'axios';
import {
  FETCH_USER,
  VERIFY_USER,
  GET_PERERITTO_USERS,
  FETCH_All_USERS,
  SHOW_MESSAGE,
  GET_WINNERS
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchAllUsers = parameters => async dispatch => {
  let params = '';
  parameters.map((parameter, index) => {
    if (index > 0) return (params += `&param${index + 1}=${parameter}`);

    return (params += `param${index + 1}=${parameter}`);
  });

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

export const getWinners = () => async dispatch => {
  const res = await axios.get(`/api/get_winners`);

  dispatch({ type: GET_WINNERS, payload: res.data });

  // May Potentially break everything?
  // dispatch({ type: SHOW_MESSAGE, payload: res.data });
};
