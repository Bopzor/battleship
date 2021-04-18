module.exports = class Ships {
  constructor() {
    this.ships = [];
  }

  setTroups(ships) {
    for (let i = 0; i < ships.length; i++) {
      this.ships[i] = this.setShip(ships[i]);
    }
  }

  setShip(ship) {
    const shipPositions = [];

    for (let i = 0; i < ship.size; i++) {
      let cell = null;

      switch (ship.direction) {
        case 'x':
          cell = [ship.start[0], ship.start[1] + i];
          break;

        case 'y':
          cell = [ship.start[0] + i, ship.start[1]];
          break;
      }

      shipPositions[i] = {
        cell,
        hit: false,
      };
    }

    return shipPositions;
  }

  isHit(cell) {
    const ship = this.belongsToShip(cell);

    if (ship) {
      for (let i = 0; i < ship.length; i++) {

        if (ship[i].cell[0] === cell[0] && ship[i].cell[1] === cell[1]) {
          ship[i].hit = true;

          return true;
        }
      }
    }

    return false;
  }

  isSink(cell) {
    const ship = this.belongsToShip(cell);

    if (ship.filter(part => !part.hit).length > 0) {
      return false;
    }

    return true;
  }

  allSank() {
    for (let i = 0; i < this.ships.length; i++) {

      if (!this.isSink(this.ships[i][0].cell)) {
        return false;
      }
    }

    return true;
  }

  belongsToShip(cell) {
    for (let i = 0; i < this.ships.length; i++) {
      for (let j = 0; j < this.ships[i].length; j++) {

        if (this.ships[i][j].cell[0] === cell[0] && this.ships[i][j].cell[1] === cell[1]) {
          return this.ships[i];
        }
      }
    }

    return false;
  }

  isAlreadyHit(cell) {
    const ship = this.belongsToShip(cell);

    const idx = ship.findIndex(p => p.cell[0] === cell[0] && p.cell[1] === cell[1]);

    if (ship[idx].hit === true) {
      return true;
    }

    return false;
  }
}
