import { GET_NOTIFICATION_GROUPS } from '../actions/types';

const intialState = {
  groups: null
};

export default function(state = intialState, action) {
  switch (action.type) {
    case GET_NOTIFICATION_GROUPS:
      return { ...state, groups: action.payload };
    default:
      return state;
  }
}
