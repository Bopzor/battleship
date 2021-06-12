import expect from 'expect';

import { Board } from './board';
import { Ship } from './ship';
import { ShotResult } from './ShotResult';

before(() => {
  // clear terminal stdout
  process.stdout.write('\x1Bc');
});

describe('Battleship', () => {
  const defaultShips: Ship[] = [
    new Ship({ x: 0, y: 0 }, 'horizontal', 2),
    new Ship({ x: 3, y: 3 }, 'vertical', 3),
  ];

  describe('ships placement', () => {
    it('places the ships in the board', () => {
      const board = new Board();

      board.ships = defaultShips;

      // prettier-ignore
      {
        expectCellsAt(board, [[0 , 0], [1, 0]], true);
        expectCellsAt(board, [[2 , 0]], false);

        expectCellsAt(board, [[3 , 3], [3, 4], [3, 5]], true);
        expectCellsAt(board, [[3 , 2], [3, 6]], false);
      }
    });

    const expectCellsAt = (board: Board, cells: [number, number][], expected: boolean) => {
      for (const [x, y] of cells) {
        expect(Boolean(board.getShipAt(x, y))).toBe(expected);
      }
    };
  });

  describe('turn', () => {
    it('sinks a ship', () => {
      const board = new Board();

      board.ships = defaultShips;

      expect(board.shoot({ x: 9, y: 0 })).toEqual(ShotResult.missed);
      expect(board.shoot({ x: 0, y: 0 })).toEqual(ShotResult.hit);
      expect(board.shoot({ x: 1, y: 0 })).toEqual(ShotResult.sank);
    });
  });

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
