export class ShipsSetEvent {
  readonly type = 'SHIPS_SET';

  constructor(readonly nick: string) {}
}
