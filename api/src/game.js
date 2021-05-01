const Ships = require('./ships.js');

module.exports = class Game {
  constructor() {
    this.state = 'idle';
    this.players = [];
    this.shipsPlayerOne = new Ships();
    this.shipsPlayerTwo = new Ships();
    this.turn = null;
    this.winner = null;
  }

  setPlayerShips(data) {
    if (data.socket === this.players[0].socket) {

      if (this.shipsPlayerOne.ships.length === 5) {
        console.log('Troups already set');
        return;
      }

      this.shipsPlayerOne.setTroups(data.ships);

      } else if (data.socket === this.players[1].socket) {

        if (this.shipsPlayerTwo.ships.length === 5) {
          console.log('Troups already set');
          return;
        }

      this.shipsPlayerTwo.setTroups(data.ships);
    }
  }

  start() {
    if (this.shipsPlayerOne.ships.length !== 5 || this.shipsPlayerTwo.ships.length !== 5) {
      return false;
    }

    this.turn = 1;
    this.state = 'start';

    return true;
  }

  opponent(socket) {
    switch (socket) {
      case this.players[0].socket:
        return this.shipsPlayerTwo;

      case this.players[1].socket:
        return this.shipsPlayerOne;
    }
  }

  isPlayer(socket) {
    switch (socket) {
      case this.players[0].socket:
        return this.players[0];

      case this.players[1].socket:
        return this.players[1];
    }
  }

  getShip(socket, cell) {
    if (socket === this.players[0].socket) {
      return this.shipsPlayerTwo.belongsToShip(cell);
    }

    if (socket === this.players[1].socket) {
      return this.shipsPlayerOne.belongsToShip(cell);
    }
  }

  play(socket, cell) {
    const opponent = this.opponent(socket);

    if (this.state === 'end')
      return 'end';

    if (opponent !== this.shipsPlayerOne && this.turn % 2 === 0)
      return 'not your turn';

    if (opponent !== this.shipsPlayerTwo && this.turn % 2 !== 0)
      return 'not your turn';

    this.turn++;

    if (opponent.isHit(cell)) {

      if (opponent.isSink(cell)) {

        if (this.win(socket)){
          this.winner = this.isPlayer(socket);

          return 'win';
        }

        return 'sank';
      }

      return 'hit';
    }

    return 'missed';
  }

  win(socket) {
    const opponent = this.opponent(socket);

    return opponent.allSank();
  }

}
