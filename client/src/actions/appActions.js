import axios from 'axios';
import { SHOW_LOADER, HIDE_LOADER, GET_VERSION } from './types';
// import {MessageTypeEnum} from '../utils/constants';

export const hideLoader = () => {
  return { type: HIDE_LOADER, payload: { message: '', open: false } };
};

export const showLoader = message => {
  return { type: SHOW_LOADER, payload: { message, open: true } };
};

export const getVersion = () => async dispatch => {
  const res = await axios.get('/api/get_version');

  dispatch({ type: GET_VERSION, payload: res.data });
};
