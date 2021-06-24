import { NickSetEvent, ShotEvent } from '../domain/gateways/battleship-gateway';
import { ShotResult } from '../redux/AppState';

export const createNickSetEvent = (partial: Partial<NickSetEvent> = {}): NickSetEvent => ({
  type: 'NICK_SET',
  nick: 'nick',
  ...partial,
});

export const createShotEvent = (partial: Partial<ShotEvent> = {}): ShotEvent => ({
  type: 'SHOT',
  nick: 'nick',
  cell: { x: 0, y: 0 },
  shotResult: ShotResult.missed,
  ...partial,
});
