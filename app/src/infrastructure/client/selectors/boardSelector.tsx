import { AppState, Cell } from '../../../redux/AppState';

export type BoardCell = {
  selected: boolean;
  validated: boolean;
  preselectedShip: boolean;
  canBePlaced: boolean;
  ship: boolean;
};

export const boardSelector = ({ game, board }: AppState): BoardCell[][] => {
  if (!game.boardSize) {
    return [];
  }

  const result: BoardCell[][] = [];
  const cells = board.ships.map((ship) => ship.cells).flat();

  for (let y = 0; y < game.boardSize; ++y) {
    result.push([]);

    for (let x = 0; x < game.boardSize; ++x) {
      const isCell = (cell?: Cell) => !!cell && cell.x === x && cell.y === y;
      const isPreselectedShipCell = Boolean(board.preselectedShip?.cells.find(isCell));

      result[y].push({
        selected: isCell(board.firstCell),
        validated: isCell(board.firstCell) && board.firstCellValidated,
        preselectedShip: isPreselectedShipCell,
        canBePlaced: isPreselectedShipCell && board.preselectedShipCanBePlaced,
        ship: Boolean(cells.find(isCell)),
      });
    }
  }

  return result;
};
