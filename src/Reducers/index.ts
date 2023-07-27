import { combineReducers } from 'redux';
import {filtersReducer} from './filtersReducer';

const rootReducer = combineReducers({
  filters: filtersReducer,
});

export default rootReducer;
