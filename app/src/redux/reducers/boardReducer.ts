import { AppState } from '../AppState';
import { AppActions } from '../types';

type BoardState = AppState['board'];

const initialState: BoardState = {
  opponentShots: [],
};

export const boardReducer = (state: BoardState = initialState, action: AppActions): BoardState => {
  if (action.type === 'shot received') {
    return {
      opponentShots: [action.payload],
    };
  }

  return state;
};
