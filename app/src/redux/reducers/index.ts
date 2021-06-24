import { combineReducers } from 'redux';

import { boardReducer } from './boardReducer';
import { playerReducer } from './playerReducer';
import { serverReducer } from './serverReducer';
import { targetReducer } from './targetReducer';

export const rootReducer = combineReducers({
  player: playerReducer,
  server: serverReducer,
  target: targetReducer,
  board: boardReducer,
});
