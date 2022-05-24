import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth';
import measureReducer from './measure';

export * from './auth';

const rootReducer = combineReducers({
  auth: authReducer,
  measure: measureReducer,
});

export default rootReducer;
