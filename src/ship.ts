import { Cell } from './Cell';
import { cellsContain, isHorizontal, isVertical } from './utils';

export type Direction = 'horizontal' | 'vertical';

export class Ship {
  constructor(private position: Cell, private direction: Direction, private size: number) {}

  isSank(shots: Cell[]): boolean {
    return this.cells.every((cell) => cellsContain(shots, cell));
  }

  get cells(): Cell[] {
    const { size, position, direction } = this;
    const cells = [];

    for (let i = 0; i < size; i++) {
      const cell = { ...position };

      if (isHorizontal(direction)) {
        cell.x += i;
      } else if (isVertical(direction)) {
        cell.y += i;
      }

      cells.push(cell);
    }

    return cells;
  }
}
