type Direction = 'horizontal' | 'vertical';
import { useEffect, useState } from 'react';

type Cell = {
  x: number;
  y: number;
};

type SheepHerd = {
  size: number;
  position: Cell;
  direction: Direction;
};

type Result = 'eaten' | 'missed' | 'killed'

type Piece = 'sheep' | 'empty' | 'eaten' | 'missed';

type Meadow = Piece[][];

export const useGame = () => {
  const [meadow, setMeadow] = useState<Meadow>();

  useEffect(() => {
    setMeadow(initMeadow());
  }, [])

  const initMeadow = (): Meadow => Array.from(Array(10), () => new Array(10).fill('empty'));

  const placeHerd = (herd: SheepHerd) => {
    if (!meadow) {
      throw Error('meadow not ready');
    }

    const meadowCopy = meadow.map((a) => a.slice());

    if (herd.direction === 'vertical') {
      for (let i = herd.position.y; i <= herd.size; i++) {
        if (meadowCopy[i][herd.position.x] !== 'empty') {
          throw Error('cell is not empty');
        }

        meadowCopy[i][herd.position.x] = 'sheep';
      }
    } else {
      for (let i = herd.position.x; i <= herd.size; i++) {
        if (meadowCopy[herd.position.y][i] !== 'empty') {
          throw Error('cell is not empty');
        }

        meadowCopy[herd.position.y][i] = 'sheep';
      }
    }

    setMeadow(meadowCopy);
  }

  const attack = (cell: Cell): Result => {
    if (!meadow) {
      throw Error('meadow not ready');
    }

    if (meadow[cell.y][cell.x] === 'sheep') {
      return 'eaten';
    }

    return 'missed';
  }
};
