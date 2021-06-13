export class PlayerAddedEvent {
  readonly type = 'PLAYER_ADDED';

  constructor(readonly nick: string) {}
}
