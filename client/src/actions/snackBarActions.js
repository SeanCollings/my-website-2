import { REMOVE_MESSAGE, SHOW_MESSAGE } from './types';
// import {MessageTypeEnum} from '../utils/constants';

export const removeMessage = () => {
  return { type: REMOVE_MESSAGE };
};

export const showMessage = (type, message) => {
  return { type: SHOW_MESSAGE, payload: { type, message } };
};
