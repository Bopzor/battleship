import { Cell } from './cell';
import { cellsContain, isHorizontal, isVertical } from './utils';

export type Direction = 'horizontal' | 'vertical';

export class Ship {
  constructor(private position: Cell, private direction: Direction, public size: number) {}

  isSank(shots: Cell[]): boolean {
    return this.cells.every((cell) => cellsContain(shots, cell));
  }

  isInBounds(boardSize: number): boolean {
    // prettier-ignore
    const { position: { x, y }, size, direction } = this;

    const maxX = isHorizontal(direction) ? x + size : x;
    const maxY = isVertical(direction) ? y + size : y;

    return maxX < boardSize && maxY < boardSize && x >= 0 && y >= 0;
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
