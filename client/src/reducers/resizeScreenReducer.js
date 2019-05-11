import { RESIZE_SCREEN } from '../actions/types';

const initialState = {
  resizeScreen: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESIZE_SCREEN:
      return action.payload;
    default:
      return state;
  }
}
