import io, { Socket } from 'socket.io-client';

import { Cell } from '../domain/cell';
import { Ship } from '../domain/ship';

export class WebSocketClient {
  private socket: Socket;

  get id() {
    return this.socket.id;
  }

  constructor(port: number) {
    this.socket = io(`ws://localhost:${port}`);
  }

  setNick(nick: string) {
    return this.emit('SET_NICK', nick);
  }

  setShips(ships: Ship[]) {
    return this.emit('SET_SHIPS', ships);
  }

  createGame(size: number, requiredShipsSizes: number[]) {
    return this.emit('CREATE_GAME', { size, requiredShipsSizes });
  }

  joinGame() {
    return this.emit('JOIN_GAME');
  }

  shoot(cell: Cell) {
    return this.emit('SHOOT', cell);
  }

  onConnect() {
    return new Promise<void>((resolve) => this.socket.on('connect', resolve));
  }

  async close() {
    await new Promise((resolve) => {
      this.socket.on('disconnect', resolve);
      this.socket.close();
    });

    await new Promise((r) => setTimeout(r, 10));
  }

  private async emit(event: string, payload?: unknown) {
    const result = await new Promise<{ status: 'ok' } | { status: 'ko'; error: string }>(
      (resolve) => this.socket.emit(event, payload, resolve),
    );

    if (result?.status !== 'ok') {
      throw new Error(result.error ?? 'WebSocketClient emit error');
    }

    return result;
  }
}
