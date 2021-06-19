import { inject, injectable } from 'inversify';

import { Board } from './Board';
import { Cell } from './Cell';
import { EndOfGameEvent } from './events/EndOfGameEvent';
import { PlayerAddedEvent } from './events/PlayerAddedEvent';
import { ShipsSetEvent } from './events/ShipsSetEvent';
import { ShotEvent } from './events/ShotEvent';
import { Game, GameRepository, GameRepositorySymbol } from './Game';
import { Player, PlayerRepository, PlayerRepositorySymbol } from './Player';
import { Ship } from './Ship';
import { ShotResult } from './ShotResult';

export type GameEvent = PlayerAddedEvent | ShipsSetEvent | ShotEvent | EndOfGameEvent;

export interface Notifier {
  notify(event: GameEvent): void;
}

export const NotifierSymbol = Symbol.for('Notifier');

@injectable()
export class GameService {
  @inject(GameRepositorySymbol)
  private readonly gameRepository!: GameRepository;

  @inject(PlayerRepositorySymbol)
  private readonly playerRepository!: PlayerRepository;

  @inject(NotifierSymbol)
  private readonly notifier!: Notifier;

  createGame(size: number, requiredShipsSizes: number[]): Game {
    const game = new Game(size, requiredShipsSizes);

    this.gameRepository.setGame(game);

    return game;
  }

  addPlayer(nick: string): Player {
    const game = this.gameRepository.getGame();

    if (!game) {
      throw new Error('There is no game');
    }

    if (this.playerRepository.countPlayers() === 2) {
      throw new Error('There already is two players.');
    }

    const player = this.playerRepository.addPlayer(nick, new Board());

    game.addPlayer(player);

    this.notifier.notify(new PlayerAddedEvent(nick));

    return player;
  }

  setShips(nick: string, ships: Ship[]): void {
    const game = this.getGame();
    const player = this.getPlayer(nick);

    game.assertShipsCanBeSet(player, ships);

    player.board.ships = ships;

    this.notifier.notify(new ShipsSetEvent(nick));

    if (game.isStarted) {
      game.setCurrentPlayer(this.playerRepository.findAll()[0]);
    }
  }

  shoot(nick: string, cell: Cell): ShotResult {
    const game = this.getGame();

    game.assertPlayerCanShoot(nick, cell);

    const opponent = game.getOpponent(nick);
    const shotResult = opponent.board.shoot(cell);

    game.setCurrentPlayer(opponent);

    this.notifier.notify(new ShotEvent(nick, cell, shotResult));

    if (opponent.board.areAllShipsSank()) {
      this.notifier.notify(new EndOfGameEvent(nick));
    }

    return shotResult;
  }

  private getPlayer(nick: string) {
    const player = this.playerRepository.findPlayerByNick(nick);

    if (!player) {
      throw new Error(`Player with nick ${nick} is not in the game.`);
    }

    return player;
  }

  private getGame() {
    const game = this.gameRepository.getGame();

    if (!game) {
      throw new Error(`Game not found.`);
    }

    return game;
  }
}
