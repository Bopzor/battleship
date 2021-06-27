import { Cell, Direction } from '../../redux/AppState';
import { createAction, UseCase } from '../../redux/types';

export const firstCellSelected = (cell: Cell) => createAction('first cell selected', cell);
export const firstCellValidated = () => createAction('first cell validated');

export const shipPreselected = (ship: Ship, canBePlaced: boolean) => {
  return createAction('ship preselected', { ship, canBePlaced });
};

export const shipPlaced = (ship: Ship) => createAction('ship placed', ship);

export type Actions = ReturnType<
  typeof firstCellSelected | typeof firstCellValidated | typeof shipPreselected | typeof shipPlaced
>;

const PI = Math.PI;
const TwoPI = 2 * Math.PI;
const toDegrees = (a: number) => a * (180 / Math.PI);

const round = (a: number) => Math.round(a * 1000) / 1000;

export class Ship {
  constructor(
    public readonly position: Cell,
    public readonly direction: Direction,
    public readonly size: number,
  ) {}

  private static directionFromCells({ x: x1, y: y1 }: Cell, { x: x2, y: y2 }: Cell): Direction {
    const alpha = (Math.atan2(y2 - y1, x2 - x1) + TwoPI) % TwoPI;

    const isBetween = (min: number, max: number) => {
      return round(alpha) > round(min) && round(alpha) < round(max);
    };

    if (isBetween(PI / 4, (3 * PI) / 4) || isBetween((5 * PI) / 4, (7 * PI) / 4)) {
      return 'vertical';
    }

    return 'horizontal';
  }

  static fromCells(c1: Cell, c2: Cell) {
    const direction = Ship.directionFromCells(c1, c2);

    if (direction === 'vertical') {
      c2.x = c1.x;
    }

    if (direction === 'horizontal') {
      c2.y = c1.y;
    }

    if (c1.x > c2.x || c1.y > c2.y) {
      [c1, c2] = [c2, c1];
    }

    const size = c2.y - c1.y + c2.x - c1.x + 1;

    return new Ship(c1, direction, size);
  }

  canBePlaced(availibleSizes: number[]): boolean {
    return availibleSizes.some((size) => size === this.size);
  }
}

export const selectCell: UseCase = (cell: Cell) => (dispatch, getState) => {
  const { board, game } = getState();
  const availableSizes = [...(game.requiredShipsSizes ?? [])];

  board.ships.forEach(({ size }) => availableSizes.splice(availableSizes.indexOf(size), 1));

  if (!availableSizes.length) {
    return;
  }

  if (!board.firstCell) {
    return dispatch(firstCellSelected(cell));
  }

  const ship = Ship.fromCells(board.firstCell, cell);

  dispatch(shipPreselected(ship, ship.canBePlaced(availableSizes)));
};

export const validateCellSelection: UseCase = () => (dispatch, getState) => {
  const { board } = getState();

  if (!board.firstCellValidated) {
    return dispatch(firstCellValidated());
  }

  if (board.preselectedShipCanBePlaced) {
    dispatch(shipPlaced(board.preselectedShip!));
  }
};
