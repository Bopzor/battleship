import { combineReducers } from 'redux';

import { boardReducer } from './boardReducer';
import { serverReducer } from './server';
import { shootReducer } from './shoot';

export const rootReducer = combineReducers({
  server: serverReducer,
  shoot: shootReducer,
  board: boardReducer,
});
