import expect from 'expect';
import { createServer, Server } from 'http';
import { Container } from 'inversify';
import * as jest from 'jest-mock';

import { Board } from '../domain/Board';
import { Cell } from '../domain/Cell';
import { Direction } from '../domain/Direction';
import { Game, GameRepository } from '../domain/Game';
import { GameService, Notifier, NotifierSymbol } from '../domain/GameService';
import { PlayerRepository, PlayerRepositorySymbol } from '../domain/Player';
import { Ship } from '../domain/Ship';
import { ShotResult } from '../domain/ShotResult';
import { InMemoryGameRepository } from '../test/InMemoryGameRepository';
import { InMemoryPlayerReposititory } from '../test/InMemoryPlayerRepository';
import { StubNotifier } from '../test/StubNotifier';
import { WebSocketClient } from '../test/WebSocketClient';

import { GameRepositorySymbol, HttpServerSymbol, WebSocketServer } from './WebSocketServer';

const port = 30001;

describe('Websocket', () => {
  let container: Container;

  let server: Server;
  let socketServer: WebSocketServer;
  const gameRepository = new InMemoryGameRepository();

  let gameService: GameService;

  before((done) => {
    server = createServer();
    server.listen(port, 'localhost', done);
  });

  after(function (done) {
    this.timeout(1000000);
    server.close(done);
  });

  beforeEach(() => {
    gameService = {} as GameService;

    container = new Container();

    container.bind<Server>(HttpServerSymbol).toConstantValue(server);
    container.bind<GameService>(GameService).toConstantValue(gameService);

    container.bind<GameRepository>(GameRepositorySymbol).to(InMemoryGameRepository);
    container.bind<PlayerRepository>(PlayerRepositorySymbol).to(InMemoryPlayerReposititory);
    container.bind<WebSocketServer>(WebSocketServer).to(WebSocketServer);
    container.bind<Notifier>(NotifierSymbol).to(StubNotifier);

    socketServer = container.get(WebSocketServer);
  });

  beforeEach(() => {
    gameRepository.reset();
  });

  describe('Socket connection', () => {
    it('creates a websocket server and accept connections', async () => {
      const socket = new WebSocketClient(port);

      await expect(socket.onConnect()).resolves.toBe(undefined);

      socket.close();
    });
  });

  describe('Game creation', () => {
    it('creates a game and add the player', async () => {
      const game = new Game(10, []);
      mockCreateGame(game);
      gameRepository.setGame(game);

      mockAddPlayer((nick) => ({ nick, board: new Board() }));

      const player1 = await createPlayerSocket();

      await player1.createGame(10, [2, 3]);

      expect(socketServer.players[player1.id]).toBeTruthy();

      await player1.close();
    });
  });

  describe("Set player's nick", () => {
    it('allows a player to set his nick', async () => {
      const game = new Game(10, []);
      mockCreateGame(game);
      gameRepository.setGame(game);

      mockAddPlayer((nick) => ({ nick, board: new Board() }));

      const player1 = await createPlayerSocket();

      await player1.createGame(10, [2, 3]);

      await player1.setNick('player1');

      expect(socketServer.players[player1.id].nick).toEqual('player1');

      await player1.close();
    });

    it('prevents a player to use a nick that is already taken', async () => {
      const game = new Game(10, []);
      mockCreateGame(game);
      gameRepository.setGame(game);

      mockAddPlayer((nick) => ({ nick, board: new Board() }));

      const player1 = await createPlayerSocket();
      const player2 = await createPlayerSocket();

      await player1.createGame(10, [2, 3]);
      await player2.joinGame();

      await player1.setNick('player1');

      await expect(player1.setNick('player1')).rejects.toThrow('player1 is already taken');
      await expect(player2.setNick('player1')).rejects.toThrow('player1 is already taken');

      await player1.close();
      await player2.close();
    });

    it('prevents to set a nick that is not a string', async () => {
      const game = new Game(10, []);
      mockCreateGame(game);
      gameRepository.setGame(game);

      mockAddPlayer((nick) => ({ nick, board: new Board() }));

      const player1 = await createPlayerSocket();
      await player1.createGame(10, [2, 3]);

      try {
        await expect(player1.setNick({})).rejects.toThrow('Given nick is not a string.');
      } finally {
        await player1.close();
      }
    });
  });

  describe('Ships placement', () => {
    it('allows a player to set his ships', async () => {
      const game = new Game(10, []);
      mockCreateGame(game);
      gameRepository.setGame(game);

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      mockSetShips(jest.fn(() => {}));

      const defaultShips: Ship[] = [
        new Ship(new Cell(0, 0), new Direction('horizontal'), 2),
        new Ship(new Cell(3, 3), new Direction('vertical'), 3),
      ];

      const [player1, player2] = await createPlayersSockets();

      try {
        await player1.setShips(defaultShips);

        expect(gameService.setShips).toHaveBeenCalledWith('player1', defaultShips);
      } finally {
        await player1.close();
        await player2.close();
      }
    });

    it('notifies when an error occures during ships placement', async () => {
      const game = new Game(10, []);
      mockCreateGame(game);
      gameRepository.setGame(game);

      mockSetShips(
        jest.fn().mockImplementation(() => {
          throw new Error('Ships placement went wrong');
        }),
      );

      const [player1, player2] = await createPlayersSockets();

      try {
        await expect(player1.setShips([])).rejects.toThrow('Ships placement went wrong');
      } finally {
        await player1.close();
        await player2.close();
      }
    });

    it('prevents to set wrongly formatted ships', async () => {
      const game = new Game(10, []);
      mockCreateGame(game);
      gameRepository.setGame(game);

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      mockSetShips(jest.fn(() => {}));

      const [player1, player2] = await createPlayersSockets();

      const expectError = (...args: any[]) =>
        expect(player1.setShips(...args)).rejects.toThrow('Given ships do not match Ship format');

      try {
        await expectError();
        await expectError([null]);
        await expectError([{}]);
        await expectError([{ position: { x: 0, y: 1 }, direction: 'vertical', size: [] }]);
        await expectError([{ position: { x: 0, y: 0 }, direction: 'vertical', size: 2.5 }]);
      } finally {
        await player1.close();
        await player2.close();
      }
    });
  });

  describe('Shoot', () => {
    it('allows a player to shoot', async () => {
      mockCreateGame(new Game(10, []));
      mockShoot(jest.fn(() => ShotResult.hit));

      const [player1, player2] = await createPlayersSockets();

      await player1.shoot(new Cell(1, 2));

      expect(gameService.shoot).toHaveBeenCalledWith('player1', { x: 1, y: 2 });

      await player1.close();
      await player2.close();
    });

    it('notifies when an error occures during shot', async () => {
      mockCreateGame(new Game(10, []));
      mockShoot(
        jest.fn<ShotResult, []>().mockImplementation(() => {
          throw new Error('Shoting went wrong');
        }),
      );

      const [player1, player2] = await createPlayersSockets();

      try {
        await expect(player1.shoot(new Cell(0, 0))).rejects.toThrow('Shoting went wrong');
      } finally {
        await player1.close();
        await player2.close();
      }
    });
  });

  const mockGameService = (mock: Partial<GameService>) => {
    Object.assign(gameService, mock);
  };

  const mockCreateGame = (game: Game) => {
    mockGameService({
      createGame: () => game,
    });
  };

  const mockAddPlayer = (addPlayer: GameService['addPlayer']) => {
    mockGameService({ addPlayer });
  };

  const mockSetShips = (setShips: GameService['setShips']) => {
    mockGameService({ setShips });
  };

  const mockShoot = (shoot: GameService['shoot']) => {
    mockGameService({ shoot });
  };

  const createPlayerSocket = async () => {
    const socket = new WebSocketClient(port);

    await socket.onConnect();

    return socket;
  };

  const createPlayersSockets = async () => {
    const player1 = await createPlayerSocket();
    const player2 = await createPlayerSocket();

    mockAddPlayer((nick) => ({ nick, board: new Board() }));

    await player1.createGame(10, [2, 3]);
    await player2.joinGame();

    await player1.setNick('player1');
    await player2.setNick('player2');

    return [player1, player2];
  };
});
