import expect from 'expect';
import { Container } from 'inversify';

import { InMemoryGameRepository } from '../test/InMemoryGameRepository';
import { InMemoryPlayerReposititory } from '../test/InMemoryPlayerRepository';
import { StubNotifier } from '../test/StubNotifier';

import { Board } from './Board';
import { Cell } from './Cell';
import { Direction } from './Direction';
import { Game, GameRepository, GameRepositorySymbol } from './Game';
import { GameService, Notifier, NotifierSymbol } from './GameService';
import { PlayerRepository, PlayerRepositorySymbol } from './Player';
import { Ship } from './Ship';
import { ShotResult } from './ShotResult';

before(() => {
  // clear terminal stdout
  process.stdout.write('\x1Bc');
});

describe('Battleship', () => {
  let gameRepository: GameRepository;
  let playerRepository: PlayerRepository;
  let notifier: StubNotifier;

  let service: GameService;

  beforeEach(() => {
    const container = new Container();

    container
      .bind<GameRepository>(GameRepositorySymbol)
      .to(InMemoryGameRepository)
      .inSingletonScope();

    container
      .bind<PlayerRepository>(PlayerRepositorySymbol)
      .to(InMemoryPlayerReposititory)
      .inSingletonScope();

    container.bind<GameService>(GameService).to(GameService).inSingletonScope();

    container.bind<Notifier>(NotifierSymbol).to(StubNotifier).inSingletonScope();

    gameRepository = container.get(GameRepositorySymbol);
    playerRepository = container.get(PlayerRepositorySymbol);
    notifier = container.get(NotifierSymbol);

    service = container.get(GameService);
  });

  const createInitializedGame = (size = 10, requiredShipsSizes = [2, 3]) => {
    const game = new Game(size, requiredShipsSizes);
    gameRepository.setGame(game);

    const player1 = playerRepository.addPlayer('player1', new Board());
    game.addPlayer(player1);

    const player2 = playerRepository.addPlayer('player2', new Board());
    game.addPlayer(player2);

    return game;
  };

  const defaultShips: Ship[] = [
    new Ship(new Cell(0, 0), new Direction('horizontal'), 2),
    new Ship(new Cell(3, 3), new Direction('vertical'), 3),
  ];

  describe('Game initialization', () => {
    it('creates a game and adds players', () => {
      gameRepository.setGame(new Game(1, []));

      service.addPlayer('player1');
      expect(notifier.lastEvent).toEqual({ type: 'PLAYER_ADDED', nick: 'player1' });

      service.addPlayer('player2');
      expect(notifier.lastEvent).toEqual({ type: 'PLAYER_ADDED', nick: 'player2' });

      expect(playerRepository.findAll()).toHaveLength(2);
    });

    it('prevents to add more than two players', () => {
      createInitializedGame();

      expect(() => service.addPlayer('player3')).toThrow('There already is two players.');
    });
  });

  describe('Ships placement', () => {
    const getPlayerShips = (nick: string) => playerRepository.findPlayerByNick(nick)?.board.ships;

    it("places the player's ships on his board", () => {
      createInitializedGame();

      service.setShips('player1', defaultShips);

      const ships = getPlayerShips('player1');

      expect(notifier.lastEvent).toEqual({ type: 'SHIPS_SET', nick: 'player1' });

      expect(ships).toEqual(ships);
    });

    it('allows the player to set his ships before another player joins', () => {
      const game = new Game(10, [2, 3]);

      gameRepository.setGame(game);

      playerRepository.addPlayer('player1', new Board());
      service.setShips('player1', defaultShips);

      expect(getPlayerShips('player1')).toEqual(defaultShips);
    });

    it('prevents to set ships of an unexisting player', () => {
      const game = createInitializedGame();

      expectSetShipsError('Player with nick player3 is not in the game.', game, 'player3')();
    });

    it('prevents to set ships more than once', () => {
      const game = createInitializedGame();

      service.setShips('player1', defaultShips);

      expectSetShipsError('Ships are already set', game)();
    });

    it('prevents to set ships outside the boundaries', () => {
      const game = createInitializedGame(5, [3]);
      const expectError = expectSetShipsError('Some ships are outside the boundaries', game);

      // position outside
      expectError(new Ship(new Cell(10, 1), new Direction('horizontal'), 3));
      expectError(new Ship(new Cell(0, 10), new Direction('horizontal'), 3));
      expectError(new Ship(new Cell(0, -5), new Direction('horizontal'), 3));
      expectError(new Ship(new Cell(-1, 10), new Direction('horizontal'), 3));

      // position + size outside
      expectError(new Ship(new Cell(2, 1), new Direction('horizontal'), 3));
      expectError(new Ship(new Cell(4, 2), new Direction('vertical'), 3));
    });

    it('prevents to set overlaping ships', () => {
      const game = createInitializedGame(10, [3, 2]);
      const expectError = expectSetShipsError(
        'Ships formation is not allowed, some are overlaping',
        game,
      );

      expectError(
        new Ship(new Cell(0, 0), new Direction('vertical'), 3),
        new Ship(new Cell(0, 0), new Direction('vertical'), 2),
      );
    });

    it("prevents to set invalid ships's position on the board", () => {
      const game = createInitializedGame(10);
      const expectError = expectSetShipsError(
        'Ships formation is not allowed, some do not meed the requirements',
        game,
      );

      expectError(new Ship(new Cell(0, 0), new Direction('vertical'), 3));
      expectError(
        new Ship(new Cell(0, 0), new Direction('vertical'), 3),
        new Ship(new Cell(2, 0), new Direction('vertical'), 3),
      );

      const gameWithDuplicateShipsSizes = createInitializedGame(10, [3, 3]);

      expectSetShipsError(
        'Ships formation is not allowed, some do not meed the requirements',
        gameWithDuplicateShipsSizes,
      )(
        new Ship(new Cell(0, 0), new Direction('vertical'), 2),
        new Ship(new Cell(2, 0), new Direction('vertical'), 3),
      );
    });

    const expectSetShipsError =
      (errorMessage: string, game: Game, nick = 'player1') =>
      (...ships: Ship[]) => {
        expect(() => service.setShips(nick, ships)).toThrow(errorMessage);
      };
  });

  describe('Game execution flow', () => {
    const createStartedGame = (
      ships = defaultShips,
      ...initialGameValue: Parameters<typeof createInitializedGame>
    ) => {
      const game = createInitializedGame(...initialGameValue);
      const players = playerRepository.findAll();

      for (const player of players) {
        player.board.ships = ships;
      }

      game.setCurrentPlayer(players[0]);

      return game;
    };

    it('plays a turn', () => {
      createStartedGame();

      const turn = (cell: Cell, shotResult: ShotResult, expectEvent = true) => {
        service.shoot('player1', new Cell(1, 1));
        expect(notifier.lastEvent).toEqual({
          type: 'SHOT',
          nick: 'player1',
          cell: new Cell(1, 1),
          shotResult: ShotResult.missed,
        });

        expect(service.shoot('player2', cell)).toEqual(shotResult);

        if (expectEvent) {
          expect(notifier.lastEvent).toEqual({
            type: 'SHOT',
            nick: 'player2',
            cell,
            shotResult,
          });
        }
      };

      turn(new Cell(1, 1), ShotResult.missed);
      turn(new Cell(0, 0), ShotResult.hit);
      turn(new Cell(1, 0), ShotResult.sank);

      turn(new Cell(3, 3), ShotResult.hit);
      turn(new Cell(3, 4), ShotResult.hit);
      turn(new Cell(3, 5), ShotResult.sank, false);

      expect(notifier.events[notifier.events.length - 2]).toEqual({
        type: 'SHOT',
        nick: 'player2',
        cell: { x: 3, y: 5 },
        shotResult: ShotResult.sank,
      });

      expect(notifier.lastEvent).toEqual({
        type: 'END_OF_GAME',
        winner: 'player2',
      });
    });

    it('prevents to shoot if both players ships are not set', () => {
      createInitializedGame();

      expect(() => service.shoot('player2', new Cell(1, 1))).toThrow('Game is not started.');

      service.setShips('player1', defaultShips);

      expect(() => service.shoot('player2', new Cell(1, 1))).toThrow('Game is not started.');
    });

    it("prevents to shoot if it's not the player's turn", () => {
      createStartedGame();

      expect(() => service.shoot('player2', new Cell(1, 1))).toThrow("It is not player2's turn.");
    });

    it('prevents to shoot a cell that is not in game bound ', () => {
      createStartedGame();

      expect(() => service.shoot('player1', new Cell(10, 1))).toThrow('Shot is out of bounds.');
      expect(() => service.shoot('player1', new Cell(0, 10))).toThrow('Shot is out of bounds.');
      expect(() => service.shoot('player1', new Cell(-5, 1))).toThrow('Shot is out of bounds.');
      expect(() => service.shoot('player1', new Cell(5, -1))).toThrow('Shot is out of bounds.');
    });

    it('prevents to shoot when the game is finished', () => {
      const ships = [new Ship(new Cell(0, 0), new Direction('horizontal'), 1)];
      createStartedGame(ships, 10, [1]);

      service.shoot('player1', new Cell(0, 0));

      expect(() => service.shoot('player2', new Cell(0, 1))).toThrow('The game is finished.');
    });
  });
});
