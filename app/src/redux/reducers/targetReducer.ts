import { AppState } from '../AppState';
import { AppActions } from '../types';

type ShootState = AppState['target'];

const initialState: ShootState = {
  shooting: false,
  shots: [],
  shootError: undefined,
};

export const targetReducer = (state: ShootState = initialState, action: AppActions): ShootState => {
  if (action.type === 'trigger shot') {
    return {
      ...state,
      shooting: true,
    };
  }

  if (action.type === 'set shot result') {
    return {
      ...state,
      shooting: false,
      shots: [...state.shots, action.payload],
    };
  }

  if (action.type === 'set shot error') {
    return {
      ...state,
      shooting: false,
      shootError: action.payload,
    };
  }

  return state;
};
