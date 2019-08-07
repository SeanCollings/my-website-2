import axios from '../utils/axios';
import {
  SHOW_LOADER,
  HIDE_LOADER,
  GET_VERSION,
  SHOW_MESSAGE,
  REMOVE_DEFERRED_PROMPT,
  NOTIFICATION_STATE,
  LOCATION_STATE,
  GET_PUBLIC_VAPID_KEY,
  RETURN_TO_PREVIOUS_PAGE,
  UPDATE_HEADING,
  SHOW_TOOLTIP,
  HIDE_TOOLTIP
} from './types';
import { MessageTypeEnum } from '../utils/constants';

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

export const getReleaseCreation = () => async dispatch => {
  const res = await axios.get('/api/get_releasecreated');

  if (res.data.type !== MessageTypeEnum.none) {
    dispatch({ type: SHOW_MESSAGE, payload: res.data });
    // } else {
    // console.log('SNACKBAR:', res.data.message);
  }
};

export const removeDeferredPrompt = message => {
  return { type: REMOVE_DEFERRED_PROMPT };
};

export const notificationState = status => {
  return { type: NOTIFICATION_STATE, payload: status };
};

export const locationState = status => {
  return { type: LOCATION_STATE, payload: status };
};

export const getPublicVapidKey = () => async dispatch => {
  const res = await axios.get('/api/get_publicvapidkey');

  dispatch({ type: GET_PUBLIC_VAPID_KEY, payload: res.data });
};

export const returnToPreviousPage = returnToPrevious => dispatch => {
  dispatch({ type: RETURN_TO_PREVIOUS_PAGE, payload: returnToPrevious });
};

export const updateHeading = heading => dispatch => {
  dispatch({ type: UPDATE_HEADING, payload: heading });
};

export const showTooltip = (
  show,
  content,
  positionX,
  positionY,
  colour
) => dispatch => {
  const tooltip = {
    show,
    content,
    positionX,
    positionY,
    colour
  };

  dispatch({ type: SHOW_TOOLTIP, payload: tooltip });
};

export const hideTooltip = () => dispatch => {
  const tooltip = {
    show: false
  };

  dispatch({ type: HIDE_TOOLTIP, payload: tooltip });
};
