import { AppState } from '../AppState';
import { AppActions } from '../types';

type ShootState = AppState['shoot'];

const initialState: ShootState = {
  shooting: false,
  shots: [],
  error: undefined,
};

export const shootReducer = (state: ShootState = initialState, action: AppActions): ShootState => {
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
      shots: [action.payload],
    };
  }

  if (action.type === 'set shot error') {
    return {
      ...state,
      shooting: false,
      error: action.payload,
    };
  }

  return state;
};
