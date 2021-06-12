type Direction = 'horizonal' | 'vertical';

export type Cell = {
  x: number;
  y: number;
};

export type Ship = {
  position: Cell;
  size: number;
  direction: Direction;
};

export enum ShotResult {
  hit = 'hit',
  missed = 'missed',
  sank = 'sank',
}

export class Board {
  private ships: Ship[] = [];
  private shots: Cell[] = [];

  setShips(ships: Ship[]): void {
    this.ships = ships;
  }

  shoot(cell: Cell): ShotResult {
    this.shots.push(cell);

    const ship = this.getShipAt(cell.x, cell.y);

    if (ship) {
      if (this.isSank(ship)) {
        return ShotResult.sank;
      }

      return ShotResult.hit;
    }

    return ShotResult.missed;
  }

  areAllShipsSank(): boolean {
    const isSank = this.isSank.bind(this);

    return this.ships.every(isSank);
  }

  getShipAt(x: number, y: number): Ship | undefined {
    for (const ship of this.ships) {
      const cells = this.getShipCells(ship);

      if (Board.cellsContain(cells, { x, y })) {
        return ship;
      }
    }
  }

  private isSank(ship: Ship): boolean {
    const cells = this.getShipCells(ship);

    for (const cell of cells) {
      if (!Board.cellsContain(this.shots, cell)) {
        return false;
      }
    }

    return true;
  }

  private getShipCells(ship: Ship): Cell[] {
    const { size, position, direction } = ship;
    const cells = [];

    for (let i = 0; i < size; i++) {
      const cell = { ...position };

      if (Board.isHorizontal(direction)) {
        cell.x += i;
      } else if (Board.isVertical(direction)) {
        cell.y += i;
      }

      cells.push(cell);
    }

    return cells;
  }

  private static isHorizontal(direction: Direction): boolean {
    return direction === 'horizonal';
  }

  private static isVertical(direction: Direction): boolean {
    return direction === 'vertical';
  }

  private static isSameCell(left: Cell, right: Cell): boolean {
    return left.x === right.x && left.y === right.y;
  }

  private static cellsContain(cells: Cell[], cell: Cell): boolean {
    return Boolean(cells.find((c) => Board.isSameCell(cell, c)));
  }
}
