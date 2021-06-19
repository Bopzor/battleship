import { EndOfGameEvent } from './events/EndOfGameEvent';
import { PlayerAddedEvent } from './events/PlayerAddedEvent';
import { ShipsSetEvent } from './events/ShipsSetEvent';
import { ShotEvent } from './events/ShotEvent';

export type GameEvent = PlayerAddedEvent | ShipsSetEvent | ShotEvent | EndOfGameEvent;

export interface Notifier {
  notify(event: GameEvent): void;
}

export const NotifierSymbol = Symbol.for('Notifier');
