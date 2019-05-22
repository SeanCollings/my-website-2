import { SHOW_LOADER, HIDE_LOADER } from './types';
// import {MessageTypeEnum} from '../utils/constants';

export const hideLoader = () => {
  return { type: HIDE_LOADER, payload: { message: '', open: false } };
};

export const showLoader = message => {
  return { type: SHOW_LOADER, payload: { message, open: true } };
};
