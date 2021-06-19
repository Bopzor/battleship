import http from 'http';
import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';

import { Cell } from '../domain/cell';
import { GameService } from '../domain/GameService';
import { Player } from '../domain/Player';
import { Ship } from '../domain/ship';

export const GameRepositorySymbol = Symbol.for('GameRepository');

export const HttpServerSymbol = Symbol.for('HttpServer');

@injectable()
export class WebSocketServer {
  @inject(GameService)
  private gameService!: GameService;

  private socketServer: Server;

  public players: Record<string, Player> = {};

  constructor(
    @inject(HttpServerSymbol)
    private server: http.Server,
  ) {
    this.socketServer = new Server(this.server);
    this.socketServer.on('connection', this.handleConnection.bind(this));
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
          // console.log(error);
          callback({ status: 'ko', error: error.message });
        }
      });
    };

    registerHandler('CREATE_GAME', this.handleCreateGame.bind(this));
    registerHandler('JOIN_GAME', this.handleJoinGame.bind(this));
    registerHandler('SET_NICK', this.handleSetNick.bind(this));
    registerHandler('SET_SHIPS', this.handleSetShips.bind(this));
    registerHandler('SHOOT', this.handleShoot.bind(this));

    socket.on('disconnect', () => {
      delete this.players[socket.id];
    });
  }

  private handleCreateGame(socket: Socket, { size, requiredShipsSizes }: any) {
    this.gameService.createGame(size, requiredShipsSizes);

    const player = this.gameService.addPlayer(socket.id);

    this.players[socket.id] = player;
  }

  private handleJoinGame(socket: Socket) {
    const player = this.gameService.addPlayer(socket.id);

    this.players[socket.id] = player;
  }

  private handleSetNick(socket: Socket, nick: unknown) {
    if (typeof nick !== 'string') {
      throw new Error('Given nick is not a string.');
    }

    if (
      Object.values(this.players)
        .map(({ nick }) => nick)
        .includes(nick as string)
    ) {
      throw new Error(`${nick} is already taken`);
    }

    const player = this.players[socket.id];

    player!.nick = nick as string;
  }

  private handleSetShips(socket: Socket, rawData: unknown) {
    if (!Array.isArray(rawData)) {
      throw new Error('Given ships do not match Ship format');
    }

    let ships: Ship[];

    try {
      ships = rawData.map((ship) => Ship.create(ship));
    } catch {
      throw new Error('Given ships do not match Ship format');
    }

    this.gameService.setShips(this.players[socket.id].nick, ships);
  }

  private handleShoot(socket: Socket, cell: unknown) {
    this.gameService.shoot(this.players[socket.id].nick, cell as Cell);
  }
}
