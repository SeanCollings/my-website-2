import { GET_NOTIFICATION_GROUPS, GET_GROUP_MEMBERS } from '../actions/types';

const intialState = {
  groups: null,
  members: null
};

export default function(state = intialState, action) {
  switch (action.type) {
    case GET_NOTIFICATION_GROUPS:
      return { ...state, groups: action.payload };
    case GET_GROUP_MEMBERS:
      return { ...state, members: action.payload };
    default:
      return state;
  }
}
