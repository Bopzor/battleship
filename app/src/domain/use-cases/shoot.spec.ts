import expect from 'expect';

import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { ShotResult } from '../../redux/AppState';
import { Store } from '../../redux/types';

import { shoot } from './shoot';

describe('shoot', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: Store;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();

    store = configureStore({
      battleshipGateway,
    });
  });

  it("shoots at the opponent's ship", async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));

    expect(store.getState()).toEqual({
      shooting: true,
      shots: [],
    });

    await battleshipGateway.resolveShoot(ShotResult.missed);

    expect(store.getState()).toEqual({
      shooting: false,
      shots: [{ position: { x: 1, y: 2 }, result: 'missed' }],
    });
  });

  it("fails to shoot at the opponent's ship", async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));

    await battleshipGateway.rejectShoot('Nope.');

    expect(store.getState()).toEqual({
      shooting: false,
      error: 'Nope.',
      shots: [],
    });
  });
});
