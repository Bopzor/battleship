import { combineReducers } from 'redux';

import { boardReducer } from './boardReducer';
import { gameReducer } from './gameReducer';
import { playerReducer } from './playerReducer';
import { serverReducer } from './serverReducer';
import { targetReducer } from './targetReducer';

export const rootReducer = combineReducers({
  game: gameReducer,
  player: playerReducer,
  server: serverReducer,
  target: targetReducer,
  board: boardReducer,
});
