import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { ShotResult } from '../../redux/AppState';
import { Store } from '../../redux/types';
import { createNickSetEvent, createShotEvent } from '../../test/createEvents';
import { ExpectStateSlice, expectStateSlice } from '../../test/expectStateSlice';

import { receiveEvent } from './receive-event';

describe('receive event', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: Store;
  let expectBoardState: ExpectStateSlice<'board'>;
  let expectTargetState: ExpectStateSlice<'target'>;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    expectBoardState = expectStateSlice(store, 'board');
    expectTargetState = expectStateSlice(store, 'target');
  });

  it('receives a player nick changed event', () => {
    const event = createNickSetEvent({ nick: 'nilscox' });

    store.dispatch(receiveEvent(event));

    expectTargetState({
      opponentNick: 'nilscox',
    });
  });

  it('receives a shot with its result', () => {
    const event = createShotEvent({ cell: { x: 1, y: 2 } });

    store.dispatch(receiveEvent(event));

    expectBoardState({
      opponentShots: [{ position: { x: 1, y: 2 }, result: ShotResult.missed }],
    });
  });

  it('receives multiple shots', () => {
    const events = [
      createShotEvent({ cell: { x: 1, y: 2 }, shotResult: ShotResult.missed }),
      createShotEvent({ cell: { x: 3, y: 1 }, shotResult: ShotResult.hit }),
    ];

    events.forEach((event) => store.dispatch(receiveEvent(event)));

    expectBoardState({
      opponentShots: [
        { position: { x: 1, y: 2 }, result: ShotResult.missed },
        { position: { x: 3, y: 1 }, result: ShotResult.hit },
      ],
    });
  });
});
