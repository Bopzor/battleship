import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { BattleshipGateway } from '../domain/gateways/battleship-gateway';
import { Actions as ShootActions } from '../domain/use-cases/shoot';

import { AppState } from './AppState';
import { configureStore } from './index';

export type Store = ReturnType<typeof configureStore>;

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

export type AppActions = ShootActions;

export type UseCase = (...args: any[]) => ThunkAction<unknown, AppState, Dependencies, AppActions>;
