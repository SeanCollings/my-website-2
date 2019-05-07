import axios from 'axios';
import { FETCH_USER, VERIFY_USER } from './types';

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
