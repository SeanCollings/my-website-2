import { combineReducers } from 'redux';
import authreducer from './authReducer';
import pererittoReducer from './pererittoReducer';

export default combineReducers({
  auth: authreducer,
  pererittoUsers: pererittoReducer
});
