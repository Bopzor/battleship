import expect from 'expect';

import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { AppState, ShotResult } from '../../redux/AppState';
import { Store } from '../../redux/types';
import { ExpectStateSlice, expectStateSlice } from '../../test/expectStateSlice';

import { connectToServer } from './connect-to-server';

describe('connection', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: Store;
  let initialState: AppState;
  let expectServerState: ExpectStateSlice<'server'>;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    initialState = store.getState();
    expectServerState = expectStateSlice(store, 'server');
  });

  it('connects to the server', async () => {
    store.dispatch(connectToServer());

    await battleshipGateway.resolveConnectToServer();

    expectServerState({
      connected: true,
      error: undefined,
    });
  });

  it('fails to connect to the server', async () => {
    store.dispatch(connectToServer());

    await battleshipGateway.rejectConnectToServer('Nope.');

    expectServerState({
      connected: false,
      error: 'Nope.',
    });
  });

  it('handles an event sent from the server', async () => {
    store.dispatch(connectToServer());

    await battleshipGateway.resolveConnectToServer();

    battleshipGateway.sendEvent({
      type: 'SHOT',
      nick: 'nick',
      cell: { x: 1, y: 2 },
      shotResult: ShotResult.hit,
    });

    expect(store.getState()).toEqual({
      ...initialState,
      server: {
        ...initialState.server,
        connected: true,
      },
      board: {
        ...initialState.board,
        opponentShots: [{ position: { x: 1, y: 2 }, result: ShotResult.hit }],
      },
    });
  });
});
