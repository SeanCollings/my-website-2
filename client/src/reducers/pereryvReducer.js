import {
  GET_PERERYV_USERS,
  GET_SLATES,
  GET_COMPLETED_SLATES
} from '../actions/types';

const initialState = {
  users: [],
  slates: [],
  completedSlates: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PERERYV_USERS:
      return { ...state, users: action.payload };
    case GET_SLATES:
      return { ...state, slates: action.payload };
    case GET_COMPLETED_SLATES:
      return { ...state, completedSlates: action.payload.count };
    default:
      return state;
  }
}
