import { Cell } from './cell';
import { Direction } from './ship';

export const isHorizontal = (direction: Direction): boolean => {
  return direction === 'horizontal';
};

export const isVertical = (direction: Direction): boolean => {
  return direction === 'vertical';
};

export const areArraysEquivalent = <T>(left: Array<T>, right: Array<T>) => {
  if (left.length !== right.length) {
    return false;
  }

  const copy = [...left];

  for (const elem of right) {
    const idx = copy.indexOf(elem);

    if (idx < 0) {
      return false;
    }

    copy.splice(idx, 1);
  }

  return true;
};

export const isSameCell = (left: Cell, right: Cell): boolean => {
  return left.x === right.x && left.y === right.y;
};

export const cellsContain = (cells: Cell[], cell: Cell): boolean => {
  return Boolean(cells.find((c) => isSameCell(cell, c)));
};
