import { injectable } from 'inversify';

import { Game, GameRepository } from '../domain/game';

@injectable()
export class InMemoryGameRepository implements GameRepository {
  private game?: Game;

  getGame(): Game | undefined {
    return this.game;
  }

  setGame(game: Game): void {
    this.game = game;
  }

  reset() {
    this.game = undefined;
  }
}
