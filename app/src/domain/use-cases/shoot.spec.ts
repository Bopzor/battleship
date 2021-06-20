import expect from 'expect';

import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { AppState, ShotResult } from '../../redux/AppState';
import { Store } from '../../redux/types';

import { shoot } from './shoot';

describe('shoot', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: Store;
  let initialState: AppState;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    initialState = store.getState();
  });

  const expectState = (partial: Partial<AppState['shoot']>) => {
    expect(store.getState()).toEqual({
      ...initialState,
      shoot: {
        ...initialState.shoot,
        ...partial,
      },
    });
  };

  it("shoots at the opponent's ship", async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));

    expectState({
      shooting: true,
      shots: [],
    });

    await battleshipGateway.resolveShoot(ShotResult.missed);

    expectState({
      shooting: false,
      shots: [{ position: { x: 1, y: 2 }, result: ShotResult.missed }],
    });
  });

  it("fails to shoot at the opponent's ship", async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));

    await battleshipGateway.rejectShoot('Nope.');

    expectState({
      shooting: false,
      error: 'Nope.',
      shots: [],
    });
  });
});
