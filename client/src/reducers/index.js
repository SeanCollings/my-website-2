import { combineReducers } from 'redux';
import authreducer from './authReducer';
import pererittoReducer from './pererittoReducer';
import maintenanceReducer from './maintenanceReducer';
import snackBarReducer from './snackBarReducer';
import resizeScreenReducer from './resizeScreenReducer';
import winnersReducer from './winnerReducer';
import settingsReducer from './settingsReducer';
import appReducer from './appReducer';
import awardReducer from './awardReducer';

export default combineReducers({
  auth: authreducer,
  pererittoUsers: pererittoReducer,
  maintenance: maintenanceReducer,
  snackBar: snackBarReducer,
  resizeScreen: resizeScreenReducer,
  winners: winnersReducer,
  settings: settingsReducer,
  app: appReducer,
  awards: awardReducer
});
