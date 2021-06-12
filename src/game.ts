import { Board } from './board';
import { Ship } from './ship';
import { areArraysEquivalent, isHorizontal, isVertical } from './utils';

type Player = {
  nick: string;
  board: Board;
};

export class Game {
  players: Player[] = [];

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
  }

  getPlayerShips(player: string): Ship[] {
    return this.getPlayer(player).board.ships;
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

  private isShipInBounds(ship: Ship): boolean {
    // prettier-ignore
    const { position: { x, y }, size, direction } = ship;

    const maxX = isHorizontal(direction) ? x + size : x;
    const maxY = isVertical(direction) ? y + size : y;

    return maxX < this.size && maxY < this.size && x >= 0 && y >= 0;
  }

  private getPlayer(nick: string): Player {
    const player = this.players.find((p) => p.nick === nick);

    if (!player) {
      throw new Error(`Player with nick ${nick} is not in the game.`);
    }

    return player;
  }
}
