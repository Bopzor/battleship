import { AppState } from '../AppState';
import { AppActions } from '../types';

type GameState = AppState['game'];

const initialState: GameState = {
  requiredShipsSizes: undefined,
};

export const gameReducer = (state: GameState = initialState, action: AppActions): GameState => {
  if (action.type === 'game fetched') {
    return {
      ...state,
      requiredShipsSizes: action.payload.requiredShipSizes,
    };
  }

  return state;
};
