import { Cell } from '.';
import { SheepHerd } from './SheepHerd';

export class Meadow {
  private _sheeps: SheepHerd[] = [];

  getHerdAt(cell: Cell): SheepHerd | undefined {
    return this.sheeps.find((sheep) => sheep.isInHerd(cell));
  }

  addHerd(herd: SheepHerd): void {
    this._sheeps.push(herd);
  }

  get sheeps() {
    return this._sheeps;
  }
}
