import { createServer } from 'http';
import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';

import { Game } from '../domain/game';
import { Player } from '../domain/Player';
import { Ship } from '../domain/ship';

export const GameRepositorySymbol = Symbol.for('GameRepository');

export interface GameRepository {
  getGame(): Game | undefined;
  setGame(game: Game): void;
}

@injectable()
export class WebSocketServer {
  @inject(GameRepositorySymbol) private gameRepository!: GameRepository;

  private server = createServer();
  private socketServer = new Server(this.server);
  private players: Record<string, Player> = {};

  constructor() {
    this.socketServer.on('connection', this.handleConnection.bind(this));
  }

  get game() {
    return this.gameRepository.getGame();
  }

  setShips(nick: string, ships: Ship[]) {
    this.game?.setShips(nick, ships);
  }

  getPlayers(): Player[] {
    if (!this.game) {
      return [];
    }

    return this.game.players;
  }

  private handleConnection(socket: Socket) {
    const registerHandler = (
      event: string,
      handler: (socket: Socket, payload: unknown) => void,
    ) => {
      socket.on(event, (payload, callback) => {
        try {
          handler(socket, payload);

          callback({ status: 'ok' });
        } catch (error) {
          callback({ status: 'ko', error: error.message });
        }
      });
    };

    registerHandler('CREATE_GAME', this.handleCreateGame.bind(this));
    registerHandler('JOIN_GAME', this.handleJoinGame.bind(this));
    registerHandler('SET_NICK', this.handleSetNick.bind(this));
    registerHandler('SET_SHIPS', this.handleSetShips.bind(this));

    socket.on('disconnect', () => {
      delete this.players[socket.id];
    });
  }

  private handleCreateGame(socket: Socket, { size, requiredShipsSizes }: any) {
    const game = new Game(size, requiredShipsSizes, () => {});

    this.gameRepository.setGame(game);
    game.addPlayer(socket.id);

    this.players[socket.id] = game.getPlayer(socket.id);
  }

  private handleJoinGame(socket: Socket) {
    this.game!.addPlayer(socket.id);

    this.players[socket.id] = this.game!.getPlayer(socket.id);
  }

  private handleSetNick(socket: Socket, nick: unknown) {
    if (
      Object.values(this.players)
        .map(({ nick }) => nick)
        .includes(nick as string)
    ) {
      throw new Error(`${nick} is already taken`);
    }

    const player = this.game!.players.find(({ nick }) => nick === this.players[socket.id].nick);

    player!.nick = nick as string;
  }

  private handleSetShips(socket: Socket, ships: unknown) {
    this.setShips(
      this.players[socket.id].nick,
      (ships as unknown[]).map((ship: any) => new Ship(ship.position, ship.direction, ship.size)),
    );
  }

  listen(port: number, hostname: string) {
    return new Promise<void>((resolve) => this.server.listen(port, hostname, resolve));
  }

  close() {
    return new Promise<void>((resolve, reject) =>
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }),
    );
  }
}
