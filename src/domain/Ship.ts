import { Cell } from './Cell';
import { Direction } from './Direction';
import { cellsContain } from './utils';

export class Ship {
  constructor(private position: Cell, private direction: Direction, public size: number) {}

  isSank(shots: Cell[]): boolean {
    return this.cells.every((cell) => cellsContain(shots, cell));
  }

  isInBounds(boardSize: number): boolean {
    // prettier-ignore
    const { position: { x, y }, size, direction } = this;

    const maxX = direction.isHorizontal() ? x + size : x;
    const maxY = direction.isVertical() ? y + size : y;

    return maxX < boardSize && maxY < boardSize && x >= 0 && y >= 0;
  }

  get cells(): Cell[] {
    const { size, position, direction } = this;
    const cells: Cell[] = [];

    for (let i = 0; i < size; i++) {
      let { x, y } = position;

      if (direction.isHorizontal()) {
        x += i;
      }

      if (direction.isVertical()) {
        y += i;
      }

      cells.push(new Cell(x, y));
    }

    return cells;
  }

  static create(rawData: any) {
    if (!rawData || typeof rawData !== 'object') {
      throw new Error('Invalid ship format.');
    }

    const { position, direction, size } = rawData;

    if (typeof size !== 'number' || size !== Math.floor(size)) {
      throw new Error('Invalid ship format.');
    }

    return new Ship(Cell.create(position), Direction.create(direction), size);
  }
}
