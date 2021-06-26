import { AppState } from '../AppState';
import { AppActions } from '../types';

type BoardState = AppState['board'];

const initialState: BoardState = {
  preselectedShip: undefined,
  firstCell: undefined,
  ships: [],
  opponentShots: [],
};

export const boardReducer = (state: BoardState = initialState, action: AppActions): BoardState => {
  switch (action.type) {
    case 'shot received':
      return {
        ...state,
        opponentShots: [...state.opponentShots, action.payload],
      };

    case 'first cell selected':
      return {
        ...state,
        firstCell: action.payload,
      };

    case 'ship preselected':
      return {
        ...state,
        preselectedShip: action.payload,
      };

    case 'ship placed':
      return {
        ...state,
        firstCell: undefined,
        preselectedShip: undefined,
        ships: [action.payload],
      };

    default:
      return state;
  }
};
