import { combineReducers } from 'redux';

import { boardReducer } from './boardReducer';
import { serverReducer } from './serverReducer';
import { shootReducer } from './shootReducer';

export const rootReducer = combineReducers({
  server: serverReducer,
  shoot: shootReducer,
  board: boardReducer,
});
