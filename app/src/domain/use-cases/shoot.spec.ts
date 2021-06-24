import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { ShotResult } from '../../redux/AppState';
import { BattleshipStore } from '../../redux/types';
import { ExpectStateSlice, expectStateSlice } from '../../test/expectStateSlice';

import { shoot } from './shoot';

describe('shoot', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: BattleshipStore;
  let expectTargetState: ExpectStateSlice<'target'>;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    expectTargetState = expectStateSlice(store, 'target');
  });

  it("shoots at the opponent's ship", async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));

    expectTargetState({
      shooting: true,
      shots: [],
    });

    await battleshipGateway.resolveShoot(ShotResult.missed);

    expectTargetState({
      shooting: false,
      shots: [{ position: { x: 1, y: 2 }, result: ShotResult.missed }],
    });
  });

  it('shoots multiple ships', async () => {
    store.dispatch(shoot({ x: 1, y: 2 }));
    await battleshipGateway.resolveShoot(ShotResult.missed);

    store.dispatch(shoot({ x: 3, y: 1 }));
    await battleshipGateway.resolveShoot(ShotResult.hit);

    expectTargetState({
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

    expectTargetState({
      shooting: false,
      shootError: 'Nope.',
      shots: [],
    });
  });
});
