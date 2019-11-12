import { TOGGLE_DICE } from '../actions/types';

const initialState = {
  showDice: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DICE:
      return { ...state, showDice: !state.showDice };
    default:
      return state;
  }
}
