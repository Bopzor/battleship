import { AppState } from './AppState';
import { AppActions } from './types';

const initialState: AppState = {
  shooting: false,
  shots: [],
  error: undefined,
};

export const rootReducer = (state: AppState = initialState, action: AppActions): AppState => {
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
