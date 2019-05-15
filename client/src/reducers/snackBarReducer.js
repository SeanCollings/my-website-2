import { SHOW_MESSAGE, REMOVE_MESSAGE } from '../actions/types';

const initialState = {
  type: 'none',
  message: '',
  open: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_MESSAGE:
      // May potentially break everything
      // if (!action.payload.type && !action.payload.message) {
      //   return initialState;
      // }
      return { ...action.payload, open: true };
    case REMOVE_MESSAGE:
      return { ...state, open: false };
    default:
      return state;
  }
}
