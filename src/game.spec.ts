import expect from 'expect';

import { Game } from './game';
import { Ship } from './ship';

describe('Battleship', () => {
  const createInitializedGame = (size = 10, requiredShipsSizes = [2, 3]) => {
    const game = new Game(size, requiredShipsSizes);

    game.addPlayer('player1');
    game.addPlayer('player2');

    return game;
  };

  describe('Game initialization', () => {
    it('creates a game and adds players', () => {
      const game = new Game(10, []);

      game.addPlayer('player1');
      game.addPlayer('player2');

      expect(game.players).toHaveLength(2);
    });

    it('prevents to add more than two players', () => {
      const game = createInitializedGame();

      expect(() => game.addPlayer('player3')).toThrow('There already is two players.');
    });
  });

  describe('Ships placement', () => {
    const defaultShips: Ship[] = [
      new Ship({ x: 0, y: 0 }, 'horizontal', 2),
      new Ship({ x: 3, y: 3 }, 'vertical', 3),
    ];

    it("places the player's ships on his board", () => {
      const game = createInitializedGame();

      game.setShips('player1', defaultShips);

      const ships = game.getPlayerShips('player1');

      expect(ships).toHaveLength(2);
      expect(game.getPlayerShips('player1')).toEqual(ships);
    });

    it('prevents to set ships of an unexisting player', () => {
      const game = createInitializedGame();

      expectSetShipsError('Player with nick player3 is not in the game.', game, 'player3')();
    });

    it('prevents to set ships more than once', () => {
      const game = createInitializedGame();

      game.setShips('player1', defaultShips);

      expectSetShipsError('Ships are already set', game)();
    });

    it('prevents to set ships outside the boundaries', () => {
      const game = createInitializedGame(5, [3]);
      const expectError = expectSetShipsError('Some ships are outside the boundaries', game);

      // position outside
      expectError(new Ship({ x: 10, y: 1 }, 'horizontal', 3));
      expectError(new Ship({ x: 0, y: 10 }, 'horizontal', 3));
      expectError(new Ship({ x: 0, y: -5 }, 'horizontal', 3));
      expectError(new Ship({ x: -1, y: 10 }, 'horizontal', 3));

      // position + size outside
      expectError(new Ship({ x: 2, y: 1 }, 'horizontal', 3));
      expectError(new Ship({ x: 4, y: 2 }, 'vertical', 3));
    });

    it('prevents to set overlaping ships', () => {
      const game = createInitializedGame(10, [3, 2]);
      const expectError = expectSetShipsError(
        'Ships formation is not allowed, some are overlaping',
        game,
      );

      expectError(new Ship({ x: 0, y: 0 }, 'vertical', 3), new Ship({ x: 0, y: 0 }, 'vertical', 2));
    });

    it("prevents to set invalid ships's position on the board", () => {
      const game = createInitializedGame(10);
      const expectError = expectSetShipsError(
        'Ships formation is not allowed, some do not meed the requirements',
        game,
      );

      expectError(new Ship({ x: 0, y: 0 }, 'vertical', 3));
      expectError(new Ship({ x: 0, y: 0 }, 'vertical', 3), new Ship({ x: 2, y: 0 }, 'vertical', 3));

      const gameWithDuplicateShipsSizes = createInitializedGame(10, [3, 3]);

      expectSetShipsError(
        'Ships formation is not allowed, some do not meed the requirements',
        gameWithDuplicateShipsSizes,
      )(new Ship({ x: 0, y: 0 }, 'vertical', 2), new Ship({ x: 2, y: 0 }, 'vertical', 3));
    });

    const expectSetShipsError =
      (errorMessage: string, game: Game, nick = 'player1') =>
      (...ships: Ship[]) => {
        expect(() => game.setShips(nick, ships)).toThrow(errorMessage);
      };
  });
});
