import {
  UPDATE_SUBSCRIPTIONS,
  SET_SUBSCRIPTION_NULL,
  GET_SPLASHES
} from '../actions/types';

const intialState = {
  subscription: null,
  splashes: null
};

export default function(state = intialState, action) {
  switch (action.type) {
    case UPDATE_SUBSCRIPTIONS:
      return { ...state, subscription: action.payload };
    case SET_SUBSCRIPTION_NULL:
      return { ...state, subscription: null };
    case GET_SPLASHES:
      return { ...state, splashes: action.payload.splashes };
    default:
      return state;
  }
}
