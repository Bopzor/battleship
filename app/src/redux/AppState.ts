export interface Cell {
  x: number;
  y: number;
}

export type Direction = 'vertical' | 'horizontal';

export interface Ship {
  position: Cell;
  direction: Direction;
  size: number;
}

export enum ShotResult {
  'missed' = 'missed',
  'hit' = 'hit',
}

export interface Shot {
  position: Cell;
  result: ShotResult;
}

export interface AppState {
  player: {
    nick?: string;
  };
  server: {
    connected: boolean;
    error: unknown;
  };
  target: {
    opponentNick?: string;
    shooting: boolean;
    shootError: unknown;
    shots: Shot[];
  };
  board: {
    preselectedShip?: Ship;
    firstCell?: Cell;
    ships: Ship[];
    opponentShots: Shot[];
  };
}
