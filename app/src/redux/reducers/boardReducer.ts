import { AppState } from '../AppState';
import { AppActions } from '../types';

type BoardState = AppState['board'];

const initialState: BoardState = {
  firstCell: undefined,
  firstCellValidated: false,
  preselectedShip: undefined,
  preselectedShipCanBePlaced: false,
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

    case 'first cell validated':
      return {
        ...state,
        firstCellValidated: true,
      };

    case 'ship preselected':
      return {
        ...state,
        preselectedShip: action.payload.ship,
        preselectedShipCanBePlaced: action.payload.canBePlaced,
      };

    case 'ship placed':
      return {
        ...state,
        firstCell: undefined,
        firstCellValidated: false,
        preselectedShip: undefined,
        preselectedShipCanBePlaced: false,
        ships: [action.payload],
      };

    default:
      return state;
  }
};
