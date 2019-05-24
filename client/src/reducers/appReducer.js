import { SHOW_LOADER, HIDE_LOADER, GET_VERSION } from '../actions/types';

const initialState = {
  message: '',
  open: false,
  version: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADER:
      return { ...state, ...action.payload };
    case HIDE_LOADER:
      return { ...state, ...action.payload };
    case GET_VERSION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
