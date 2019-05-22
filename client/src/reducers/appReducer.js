import { SHOW_LOADER, HIDE_LOADER } from '../actions/types';

const initialState = {
  message: '',
  open: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADER:
      console.log('REDUCER: show message ', action.payload.message);
      return action.payload;
    case HIDE_LOADER:
      console.log('REDUCER: Hide Loader');
      return action.payload;
    default:
      return state;
  }
}
