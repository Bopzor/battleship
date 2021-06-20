export interface Cell {
  x: number;
  y: number;
}

export enum ShotResult {
  'missed' = 'missed',
}

export interface Shot {
  position: Cell;
  result: ShotResult;
}

export interface AppState {
  shooting: boolean;
  shots: Shot[];
  error: unknown;
}
