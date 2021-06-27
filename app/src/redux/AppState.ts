import { Ship } from '../domain/use-cases/select-cell';

export interface Cell {
  x: number;
  y: number;
}

export type Direction = 'vertical' | 'horizontal';

export enum ShotResult {
  'missed' = 'missed',
  'hit' = 'hit',
}

export interface Shot {
  position: Cell;
  result: ShotResult;
}

export interface AppState {
  game: {
    boardSize?: number;
    requiredShipsSizes?: number[];
  };

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
    firstCell?: Cell;
    firstCellValidated: boolean;
    preselectedShip?: Ship;
    preselectedShipCanBePlaced: boolean;
    ships: Ship[];
    opponentShots: Shot[];
  };
}
