import { Cell, Direction, isHorizontal, isVertical } from '.';

const EATEN = 'eaten';
const MISSED = 'missed';
const DEAD = 'dead';

export class SheepHerd {
  private count: number;
  private isDead = false;

  constructor(
    public size: number,
    public position: Cell,
    public direction: Direction,
  ) {
    this.count = size;
  }

  attack(cell: Cell): typeof EATEN | typeof MISSED | typeof DEAD {
    if (this.isInHerd(cell)) {
      this.killASheep();

      if (this.isDead) {
        return DEAD;
      }

      return EATEN;
    }

    return MISSED;
  }

  isInHerd(cell: Cell) {
    if (this.isHorizontal() && this.isOnTheSameLine(cell)) {
      if (cell.x >= this.position.x && cell.x < this.position.x + this.size) {
        return true;
      }
    }

    if (this.isVertical() && this.isOnTheSameLine(cell)) {
      if (cell.y >= this.position.y && cell.y < this.position.y + this.size) {
        return true;
      }
    }

    return false;
  }

  private isOnTheSameLine(cell: Cell) {
    if (this.isHorizontal()) {
      return this.position.y === cell.y;
    }

    if (this.isVertical()) {
      return this.position.x === cell.x;
    }
  }

  private isHorizontal() {
    return isHorizontal(this.direction);
  }

  private isVertical() {
    return isVertical(this.direction);
  }

  private killASheep() {
    this.count--;

    if (this.count <= 0) {
      this.isDead = true;
    }
  }
}
