import {
  UPDATE_SUBSCRIPTIONS,
  SET_SUBSCRIPTION_NULL,
  TEST_NOTIFICATION
} from '../actions/types';

const intialState = {
  subscription: null
};

export default function(state = intialState, action) {
  switch (action.type) {
    case UPDATE_SUBSCRIPTIONS:
      return { ...state, subscription: action.payload };
    case SET_SUBSCRIPTION_NULL:
      return { ...state, subscription: null };
    case TEST_NOTIFICATION:
      return state;
    default:
      return state;
  }
}
