import { combineReducers } from 'redux';

import { boardReducer } from './boardReducer';
import { serverReducer } from './serverReducer';
import { targetReducer } from './targetReducer';

export const rootReducer = combineReducers({
  server: serverReducer,
  target: targetReducer,
  board: boardReducer,
});
