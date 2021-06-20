import { AppState } from '../AppState';
import { AppActions } from '../types';

type ServerState = AppState['server'];

const initialState: ServerState = {
  connected: false,
  error: undefined,
};

export const serverReducer = (
  state: ServerState = initialState,
  action: AppActions,
): ServerState => {
  if (action.type === 'connected to server') {
    return {
      connected: true,
      error: undefined,
    };
  }

  if (action.type === 'server connection error') {
    return {
      connected: false,
      error: action.payload,
    };
  }

  return state;
};
