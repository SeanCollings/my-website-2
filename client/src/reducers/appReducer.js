import { SHOW_LOADER, HIDE_LOADER } from '../actions/types';

const initialState = {
  message: '',
  open: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADER:
      return action.payload;
    case HIDE_LOADER:
      return action.payload;
    default:
      return state;
  }
}
