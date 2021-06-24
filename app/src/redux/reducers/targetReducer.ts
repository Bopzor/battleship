import { AppState } from '../AppState';
import { AppActions } from '../types';

type TargetState = AppState['target'];

const initialState: TargetState = {
  opponentNick: undefined,
  shooting: false,
  shots: [],
  shootError: undefined,
};

export const targetReducer = (
  state: TargetState = initialState,
  action: AppActions,
): TargetState => {
  if (action.type === 'opponent nick set') {
    return {
      ...state,
      opponentNick: action.payload,
    };
  }

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
