import expect from 'expect';

import { Board } from './board';
import { Ship } from './ship';

before(() => {
  // clear terminal stdout
  process.stdout.write('\x1Bc');
});

describe('Battleship', () => {
  const defaultShips: Ship[] = [
    new Ship({ x: 0, y: 0 }, 'horizontal', 2),
    new Ship({ x: 3, y: 3 }, 'vertical', 3),
  ];

  describe('all ships are sank', () => {
    it('tells when all ships are sank', () => {
      const board = new Board();

      board.ships = defaultShips;

      expect(board.areAllShipsSank()).toBe(false);

      sinkAllShips(board);

      expect(board.areAllShipsSank()).toBe(true);
    });

    const sinkAllShips = (board: Board): void => {
      // prettier-ignore
      const shots = [
        [0, 0], [1, 0],
        [3, 3], [3, 4], [3, 5],
      ]

      for (const [x, y] of shots) {
        board.shoot({ x, y });
      }
    };
  });
});
