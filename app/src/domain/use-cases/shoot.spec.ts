import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { ShotResult } from '../../redux/AppState';
import { Store } from '../../redux/types';
import { ExpectStateSlice, expectStateSlice } from '../../test/expectStateSlice';

import { shoot } from './shoot';

describe('shoot', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: Store;
  let expectShootState: ExpectStateSlice<'shoot'>;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    expectShootState = expectStateSlice(store, 'shoot');
  });

  it("shoots at the opponent's ship", async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));

    expectShootState({
      shooting: true,
      shots: [],
    });

    await battleshipGateway.resolveShoot(ShotResult.missed);

    expectShootState({
      shooting: false,
      shots: [{ position: { x: 1, y: 2 }, result: ShotResult.missed }],
    });
  });

  it('shoots multiple ships', async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));
    await battleshipGateway.resolveShoot(ShotResult.missed);

    store.dispatch(shoot({ x: 3, y: 1 }));
    await battleshipGateway.resolveShoot(ShotResult.hit);

    expectShootState({
      shooting: false,
      shots: [
        { position: { x: 1, y: 2 }, result: ShotResult.missed },
        { position: { x: 3, y: 1 }, result: ShotResult.hit },
      ],
    });
  });

  it("fails to shoot at the opponent's ship", async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));

    await battleshipGateway.rejectShoot('Nope.');

    expectShootState({
      shooting: false,
      error: 'Nope.',
      shots: [],
    });
  });
});
