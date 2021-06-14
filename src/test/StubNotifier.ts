import { injectable } from 'inversify';

import { GameEvent, Notifier } from '../domain/GameService';

@injectable()
export class StubNotifier implements Notifier {
  events: GameEvent[] = [];
  notify = this.events.push.bind(this.events);

  get lastEvent() {
    return this.events[this.events.length - 1];
  }
}
