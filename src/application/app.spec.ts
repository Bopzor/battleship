import expect from 'expect';
import io, { Socket } from 'socket.io-client';

import { Ship } from '../domain/ship';

import { WebSocketServer } from './WebSocketServer';

class WebSocketClient {
  private socket: Socket;

  constructor(port: number) {
    this.socket = io(`ws://localhost:${port}`);
  }

  setNick(nick: string) {
    return this.emit('SET_NICK', nick);
  }

  setShips(ships: Ship[]) {
    return this.emit('SET_SHIPS', ships);
  }

  createGame(size: number, requiredShipsSizes: number[]) {
    return this.emit('CREATE_GAME', { size, requiredShipsSizes });
  }

  joinGame() {
    return this.emit('JOIN_GAME');
  }

  onConnect() {
    return new Promise<void>((resolve) => this.socket.on('connect', resolve));
  }

  close() {
    this.socket.close();
  }

  private async emit(event: string, payload?: unknown) {
    const result = await new Promise<{ status: 'ok' } | { status: 'ko'; error: string }>(
      (resolve) => this.socket.emit(event, payload, resolve),
    );

    if (result?.status !== 'ok') {
      throw new Error(result.error ?? 'WebSocketClient emit error');
    }

    return result;
  }
}

describe.only('Websocket', () => {
  let socketServer: WebSocketServer;

  before(async () => {
    socketServer = new WebSocketServer();

    await socketServer.listen(3000, 'localhost');
  });

  after(async () => {
    await socketServer.close();
  });

  beforeEach(() => {
    socketServer.reset();
  });

  it('creates a websocket server and accept connections', async () => {
    const socket = new WebSocketClient(3000);

    await expect(socket.onConnect()).resolves.toBe(undefined);

    socket.close();
  });

  it("creates a game and add the player on player's connection", async () => {
    expect(socketServer.game).toBeUndefined();

    const socket = await createInitializedGame();

    const players = socketServer.getPlayers();
    expect(players).toHaveLength(1);
    expect(players[0]).toMatchObject({ nick: expect.any(String) });

    socket.close();
  });

  it('allows a player to set his nick', async () => {
    const player1 = await createInitializedGame();
    const player2 = await createPlayerSocket();
    await player2.joinGame();

    await player1.setNick('player1');
    await player2.setNick('player2');

    const players = socketServer.getPlayers();

    expect(players[0]).toHaveProperty('nick', 'player1');
    expect(players[1]).toHaveProperty('nick', 'player2');

    player1.close();
    player2.close();
  });

  it('prevents a player to use a nick that is already taken', async () => {
    const player1 = await createInitializedGame();
    const player2 = await createPlayerSocket();
    await player2.joinGame();

    await player1.setNick('player1');
    await expect(player1.setNick('player1')).rejects.toThrow('player1 is already taken');
    await expect(player2.setNick('player1')).rejects.toThrow('player1 is already taken');

    player1.close();
    player2.close();
  });

  it('allows a player to set his ships', async () => {
    const defaultShips: Ship[] = [
      new Ship({ x: 0, y: 0 }, 'horizontal', 2),
      new Ship({ x: 3, y: 3 }, 'vertical', 3),
    ];

    const socket = await createInitializedGame();
    await socket.setNick('player1');

    await socket.setShips(defaultShips);

    expect(socketServer.game?.getPlayerShips('player1')).toHaveLength(2);

    socket.close();
  });

  const createPlayerSocket = async () => {
    const socket = new WebSocketClient(3000);

    await socket.onConnect();

    return socket;
  };

  const createInitializedGame = async (): Promise<WebSocketClient> => {
    const socket = await createPlayerSocket();
    await socket.createGame(10, [2, 3]);

    return socket;
  };
});
