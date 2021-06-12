import { Board } from './board';
import { Cell } from './cell';
import { Ship } from './ship';
import { ShotResult } from './ShotResult';
import { areArraysEquivalent } from './utils';

type Player = {
  nick: string;
  board: Board;
};

export class Game {
  players: Player[] = [];
  private currentPlayer?: Player;

  constructor(private size: number, private requiredShipsSizes: number[]) {}

  addPlayer(nick: string): void {
    if (this.players.length === 2) {
      throw new Error('There already is two players.');
    }

    this.players.push({
      nick,
      board: new Board(),
    });
  }

  setShips(nick: string, ships: Ship[]): void {
    const player = this.getPlayer(nick);

    this.assertShipsCanBeSet(player, ships);

    player.board.ships = ships;

    if (this.isStarted) {
      this.currentPlayer = this.players[0];
    }
  }

  shoot(nick: string, cell: Cell): ShotResult {
    this.assertPlayerCanShoot(nick, cell);

    const opponent = this.getOpponent(nick);
    const shotResult = opponent.board.shoot(cell);

    this.currentPlayer = opponent;

    return shotResult;
  }

  getPlayerShips(player: string): Ship[] {
    return this.getPlayer(player).board.ships;
  }

  private isPlayerTurn(nick: string): boolean {
    return this.currentPlayer?.nick === nick;
  }

  private get isStarted(): boolean {
    return this.players[0].board.ships.length > 0 && this.players[1].board.ships.length > 0;
  }

  private assertPlayerCanShoot(nick: string, cell: Cell) {
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

  private assertShipsCanBeSet(player: Player, ships: Ship[]) {
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

  private getPlayer(nick: string): Player {
    const player = this.players.find((p) => p.nick === nick);

    if (!player) {
      throw new Error(`Player with nick ${nick} is not in the game.`);
    }

    return player;
  }

  private getOpponent(nick: string): Player {
    const idx = this.players.findIndex((p) => p.nick === nick);

    return this.players[(idx + 1) % 2];
  }
}
