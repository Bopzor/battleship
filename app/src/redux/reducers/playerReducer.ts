import { AppState } from '../AppState';
import { AppActions } from '../types';

type PlayerState = AppState['player'];

const initialState: PlayerState = {
  nick: undefined,
};

export const playerReducer = (
  state: PlayerState = initialState,
  action: AppActions,
): PlayerState => {
  if (action.type === 'nick set') {
    return {
      nick: action.payload,
    };
  }

  return state;
};
