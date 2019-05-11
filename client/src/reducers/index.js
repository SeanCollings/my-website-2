import { combineReducers } from 'redux';
import authreducer from './authReducer';
import pererittoReducer from './pererittoReducer';
import maintenanceReducer from './maintenanceReducer';
import snackBarReducer from './snackBarReducer';
import resizeScreenReducer from './resizeScreenReducer';

export default combineReducers({
  auth: authreducer,
  pererittoUsers: pererittoReducer,
  maintenance: maintenanceReducer,
  snackBar: snackBarReducer,
  resizeScreen: resizeScreenReducer
});
