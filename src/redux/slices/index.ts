import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth';
import measureReducer from './measure';
import productReducer from './product';
import productGroupReducer from './productGroup';
import productListReducer from './productList';
import supplierReducer from './supplier';
import treatmentGroupReducer from './treatmentGroup';
import usageReducer from './usage';
import salesOrderReducer from './salesOrder';

export * from './auth';

const rootReducer = combineReducers({
  auth: authReducer,
  measure: measureReducer,
  supplier: supplierReducer,
  usage: usageReducer,
  treatmentGroup: treatmentGroupReducer,
  productGroup: productGroupReducer,
  product: productReducer,
  productList: productListReducer,
  salesOrder: salesOrderReducer,
});

export default rootReducer;
