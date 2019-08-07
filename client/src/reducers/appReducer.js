import {
  SHOW_LOADER,
  HIDE_LOADER,
  GET_VERSION,
  BEFORE_INSTALL_PROMPT,
  REMOVE_DEFERRED_PROMPT,
  NOTIFICATION_STATE,
  LOCATION_STATE,
  GET_PUBLIC_VAPID_KEY,
  RETURN_TO_PREVIOUS_PAGE,
  UPDATE_HEADING,
  SHOW_TOOLTIP,
  HIDE_TOOLTIP
} from '../actions/types';

const initialState = {
  message: '',
  open: false,
  version: '',
  deferredPrompt: null,
  notificationState: null,
  locationState: null,
  publicVapidKey: null,
  returnToPreviousPage: false,
  headingName: null,
  tooltip: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADER:
      return { ...state, ...action.payload };
    case HIDE_LOADER:
      return { ...state, ...action.payload };
    case GET_VERSION:
      return { ...state, ...action.payload };
    case BEFORE_INSTALL_PROMPT:
      return { ...state, deferredPrompt: action.payload };
    case REMOVE_DEFERRED_PROMPT:
      return { ...state, deferredPrompt: null };
    case NOTIFICATION_STATE:
      return { ...state, notificationState: action.payload };
    case LOCATION_STATE:
      return { ...state, locationState: action.payload };
    case GET_PUBLIC_VAPID_KEY:
      return { ...state, publicVapidKey: action.payload };
    case RETURN_TO_PREVIOUS_PAGE:
      return { ...state, returnToPreviousPage: action.payload };
    case UPDATE_HEADING:
      return { ...state, headingName: action.payload };
    case SHOW_TOOLTIP:
      return { ...state, tooltip: action.payload };
    case HIDE_TOOLTIP:
      return { ...state, tooltip: null };
    default:
      return state;
  }
}
