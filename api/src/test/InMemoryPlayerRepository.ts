import { injectable } from 'inversify';

import { Board } from '../domain/Board';
import { Player, PlayerRepository } from '../domain/Player';

@injectable()
export class InMemoryPlayerRepository implements PlayerRepository {
  private players: Player[] = [];

  countPlayers(): number {
    return this.players.length;
  }

  addPlayer(nick: string, board: Board): Player {
    const player: Player = {
      nick,
      board,
    };

    this.players.push(player);

    return player;
  }

  findPlayerByNick(nick: string): Player | undefined {
    return this.players.find((player) => player.nick === nick);
  }

  findAll(): Player[] {
    return this.players;
  }
}
