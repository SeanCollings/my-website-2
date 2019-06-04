import {
  SHOW_LOADER,
  HIDE_LOADER,
  GET_VERSION,
  BEFORE_INSTALL_PROMPT,
  REMOVE_DEFERRED_PROMPT,
  NOTIFICATION_STATE
} from '../actions/types';

const initialState = {
  message: '',
  open: false,
  version: '',
  deferredPrompt: null,
  notificationState: null
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
    default:
      return state;
  }
}
