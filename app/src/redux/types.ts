import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { BattleshipGateway } from '../domain/gateways/battleship-gateway';
import { Actions as ConnectToServerActions } from '../domain/use-cases/connect-to-server';
import { Actions as GetGameActions } from '../domain/use-cases/get-game';
import { Actions as ReceiveEventActions } from '../domain/use-cases/receive-event';
import { Actions as SelectCellActions } from '../domain/use-cases/select-cell';
import { Actions as SetNickActions } from '../domain/use-cases/set-nick';
import { Actions as ShootActions } from '../domain/use-cases/shoot';

import { AppState } from './AppState';
import { configureStore } from './index';

export type BattleshipStore = ReturnType<typeof configureStore>;

export interface Dependencies {
  battleshipGateway: BattleshipGateway;
}

interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;

export function createAction<T extends string, P>(type: T, payload?: P) {
  if (payload) {
    return { type, payload };
  }

  return { type };
}

export type AppActions =
  | ConnectToServerActions
  | ShootActions
  | GetGameActions
  | ReceiveEventActions
  | SelectCellActions
  | SetNickActions;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseCase = (...args: any[]) => ThunkAction<unknown, AppState, Dependencies, AppActions>;
