import expect from 'expect';

import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { AppState } from '../../redux/AppState';
import { Store } from '../../redux/types';

import { connectToServer } from './connect-to-server';

describe('connection', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: Store;
  let initialState: AppState;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    initialState = store.getState();
  });

  const expectState = (partial: Partial<AppState['server']>) => {
    expect(store.getState()).toEqual({
      ...initialState,
      server: {
        ...initialState.server,
        ...partial,
      },
    });
  };

  it('connects to the server', async () => {
    store.dispatch(connectToServer());

    await battleshipGateway.resolveConnectToServer();

    expectState({
      connected: true,
      error: undefined,
    });
  });

  it('fails to connect to the server', async () => {
    store.dispatch(connectToServer());

    await battleshipGateway.rejectConnectToServer('Nope.');

    expectState({
      connected: false,
      error: 'Nope.',
    });
  });
});
