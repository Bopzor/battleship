export class EndOfGameEvent {
  readonly type = 'END_OF_GAME';

  constructor(readonly winner: string) {}
}
