export interface Cell {
  x: number;
  y: number;
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
  server: {
    connected: boolean;
    error: unknown;
  };
  target: {
    shooting: boolean;
    shootError: unknown;
    shots: Shot[];
  };
  board: {
    opponentShots: Shot[];
  };
}
