import { Cell } from './Cell';
import { Player } from './Player';
import { Ship } from './Ship';
import { areArraysEquivalent } from './utils';

export interface GameRepository {
  getGame(): Game | undefined;
  setGame(game: Game): void;
}

export const GameRepositorySymbol = Symbol.for('GameRepository');

export class Game {
  private currentPlayer?: Player;
  private players: Player[] = [];

  constructor(private size: number, private requiredShipsSizes: number[]) {}

  get isStarted(): boolean {
    const hasShips = (player: Player) => {
      return player.board.ships.length > 0;
    };

    return this.players.length === 2 && this.players.every(hasShips);
  }

  setCurrentPlayer(player: Player) {
    this.currentPlayer = player;
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  assertPlayerCanShoot(nick: string, cell: Cell) {
    if (!this.isStarted) {
      throw new Error('Game is not started.');
    }

    if (this.isGameFinished()) {
      throw new Error('The game is finished.');
    }

    if (!this.isPlayerTurn(nick)) {
      throw new Error(`It is not ${nick}'s turn.`);
    }

    if (!this.isCellInBounds(cell)) {
      throw new Error('Shot is out of bounds.');
    }
  }

  assertShipsCanBeSet(player: Player, ships: Ship[]) {
    if (this.arePlayerShipsSet(player)) {
      throw new Error('Ships are already set.');
    }

    if (!this.areShipsInBounds(ships)) {
      throw new Error('Some ships are outside the boundaries');
    }

    if (!this.areShipsAllowed(ships)) {
      throw new Error('Ships formation is not allowed, some do not meed the requirements');
    }

    if (this.areShipsOverlaping(ships)) {
      throw new Error('Ships formation is not allowed, some are overlaping.');
    }
  }

  private isPlayerTurn(nick: string): boolean {
    return this.currentPlayer?.nick === nick;
  }

  private areShipsOverlaping(ships: Ship[]): boolean {
    const cells = ships.map(({ cells }) => cells.map(({ x, y }) => `${x}:${y}`)).flat();
    const uniqCells = new Set(cells);

    return cells.length !== uniqCells.size;
  }

  private arePlayerShipsSet(player: Player): boolean {
    return player.board.ships.length > 0;
  }

  private areShipsInBounds(ships: Ship[]): boolean {
    const isShipInBounds = this.isShipInBounds.bind(this);

    return ships.every(isShipInBounds);
  }

  private areShipsAllowed(ships: Ship[]): boolean {
    const shipsSizes: number[] = ships.map(({ size }) => size);

    return areArraysEquivalent(shipsSizes, this.requiredShipsSizes);
  }

  private isGameFinished(): boolean {
    return this.players.some(({ board }) => board.areAllShipsSank());
  }

  private isShipInBounds(ship: Ship): boolean {
    return ship.isInBounds(this.size);
  }

  private isCellInBounds({ x, y }: Cell): boolean {
    return x < this.size && y < this.size && x >= 0 && y >= 0;
  }

  getOpponent(nick: string): Player {
    const idx = this.players.findIndex((p) => p.nick === nick);

    return this.players[(idx + 1) % 2];
  }
}
