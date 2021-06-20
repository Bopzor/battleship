import expect from 'expect';

import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { AppState, ShotResult } from '../../redux/AppState';
import { Store } from '../../redux/types';

import { receiveShot } from './receive-shot';

describe('receive shot', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: Store;
  let initialState: AppState;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    initialState = store.getState();
  });

  const expectState = (partial: Partial<AppState['board']>) => {
    expect(store.getState()).toEqual({
      ...initialState,
      board: {
        ...initialState.board,
        ...partial,
      },
    });
  };

  it('receives a shot with its result', () => {
    store.dispatch(receiveShot({ position: { x: 1, y: 2 }, result: ShotResult.missed }));

    expectState({
      opponentShots: [{ position: { x: 1, y: 2 }, result: ShotResult.missed }],
    });
  });

  it('receives multiple shots', () => {
    store.dispatch(receiveShot({ position: { x: 1, y: 2 }, result: ShotResult.missed }));
    store.dispatch(receiveShot({ position: { x: 3, y: 1 }, result: ShotResult.hit }));

    expectState({
      opponentShots: [
        { position: { x: 1, y: 2 }, result: ShotResult.missed },
        { position: { x: 3, y: 1 }, result: ShotResult.hit },
      ],
    });
  });
});
