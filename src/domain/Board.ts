import { Cell } from './Cell';
import { Ship } from './Ship';
import { ShotResult } from './ShotResult';
import { cellsContain } from './utils';

export class Board {
  public ships: Ship[] = [];
  private shots: Cell[] = [];

  shoot(cell: Cell): ShotResult {
    this.shots.push(cell);

    const ship = this.getShipAt(cell);

    if (ship) {
      if (ship.isSank(this.shots)) {
        return ShotResult.sank;
      }

      return ShotResult.hit;
    }

    return ShotResult.missed;
  }

  areAllShipsSank(): boolean {
    return this.ships.every((ship) => ship.isSank(this.shots));
  }

  getShipAt(cell: Cell): Ship | undefined {
    return this.ships.find((ship) => {
      return cellsContain(ship.cells, cell);
    });
  }
}
