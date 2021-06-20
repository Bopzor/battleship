import expect from 'expect';
import { Server } from 'http';

import { bootstrap } from './application';
import { EndOfGameEvent } from './domain/events/EndOfGameEvent';
import { waitFor } from './test/waitFor';
import { WebSocketClient } from './test/WebSocketClient';

const port = 30001;

describe('Play a game', () => {
  let server: Server;

  before((done) => {
    server = bootstrap();

    server.listen(port, 'localhost', done);
  });

  after(function (done) {
    server.close(done);
  });

  it('plays', async () => {
    const player1 = new WebSocketClient(port);
    const player2 = new WebSocketClient(port);

    try {
      await player1.onConnect();
      await player1.createGame(10, [2, 3]);
      await player2.joinGame();

      player1.setNick('player1');
      player2.setNick('player2');

      await player1.setShips([
        { position: { x: 1, y: 6 }, direction: 'horizontal', size: 2 },
        { position: { x: 5, y: 0 }, direction: 'vertical', size: 3 },
      ]);
      await player2.setShips([
        { position: { x: 2, y: 5 }, direction: 'horizontal', size: 3 },
        { position: { x: 8, y: 2 }, direction: 'vertical', size: 2 },
      ]);

      await shoot(player1, { x: 0, y: 0 }); // miss
      await shoot(player2, { x: 3, y: 4 }); // miss

      await shoot(player1, { x: 2, y: 5 }); // hit
      await shoot(player2, { x: 3, y: 6 }); // miss

      await shoot(player1, { x: 3, y: 5 }); // hit
      await shoot(player2, { x: 5, y: 2 }); // hit

      await shoot(player1, { x: 4, y: 5 }); // sank
      await shoot(player2, { x: 8, y: 8 }); // miss

      await shoot(player1, { x: 8, y: 2 }); // hit
      await shoot(player2, { x: 4, y: 7 }); // miss

      await shoot(player1, { x: 8, y: 3 }); // sank

      const endOfGameEvent = new EndOfGameEvent('player1');

      await waitFor(() => expect(player1.lastEvent).toEqual(endOfGameEvent));
    } finally {
      await player1.close();
      await player2.close();
    }
  });

  const shoot = async (player: WebSocketClient, cell: { x: number; y: number }) => {
    await player.shoot(cell);
  };
});
