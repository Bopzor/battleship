import { injectable } from 'inversify';

import { Game, GameRepository } from '../domain/Game';

@injectable()
export class InMemoryGameRepository implements GameRepository {
  private game?: Game;

  getGame(): Game | undefined {
    return this.game;
  }

  setGame(game: Game): void {
    this.game = game;
  }
}
