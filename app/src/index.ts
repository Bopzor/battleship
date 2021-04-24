export type Cell = {
  x: number;
  y: number;
};

export type Direction = 'vertical' | 'horizontal';

export const isVertical = (direction: Direction): boolean => {
  return direction === 'vertical';
};

export const isHorizontal = (direction: Direction): boolean => {
  return direction === 'horizontal';
};
