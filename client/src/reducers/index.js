import { combineReducers } from 'redux';
import authreducer from './authReducer';
import pererittoReducer from './pererittoReducer';
import maintenanceReducer from './maintenanceReducer';

export default combineReducers({
  auth: authreducer,
  pererittoUsers: pererittoReducer,
  maintenance: maintenanceReducer
});
