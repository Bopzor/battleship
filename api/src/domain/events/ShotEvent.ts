import { Cell } from '../Cell';
import { ShotResult } from '../ShotResult';

export class ShotEvent {
  readonly type = 'SHOT';

  constructor(readonly nick: string, readonly cell: Cell, readonly shotResult: ShotResult) {}
}