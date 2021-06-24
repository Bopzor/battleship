import { InMemoryBattleshipGateway } from '../../infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from '../../redux';
import { Store } from '../../redux/types';
import { ExpectStateSlice, expectStateSlice } from '../../test/expectStateSlice';

import { setNick } from './set-nick';

describe('set nick', () => {
  let battleshipGateway: InMemoryBattleshipGateway;
  let store: Store;
  let expectPlayerState: ExpectStateSlice<'player'>;

  beforeEach(() => {
    battleshipGateway = new InMemoryBattleshipGateway();
    store = configureStore({ battleshipGateway });
    expectPlayerState = expectStateSlice(store, 'player');
  });

  it("sets the player's nick", async () => {
    await store.dispatch(setNick('bopzor'));

    expectPlayerState({
      nick: 'bopzor',
    });
  });
});
