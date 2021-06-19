import io, { Socket } from 'socket.io-client';

import { Cell } from '../domain/Cell';
import { Ship } from '../domain/Ship';

export class WebSocketClient {
  private socket: Socket;
  private events: unknown[] = [];

  get id() {
    return this.socket.id;
  }

  get lastEvent() {
    return this.events[this.events.length - 1];
  }

  constructor(port: number) {
    this.socket = io(`ws://localhost:${port}`);

    this.socket.on('message', this.onEvent.bind(this));
  }

  setNick(...args: [string] | unknown[]) {
    return this.emit('SET_NICK', ...args);
  }

  setShips(...args: [Ship[]] | unknown[]) {
    return this.emit('SET_SHIPS', ...args);
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

  onEvent(event: unknown) {
    this.events.push(event);
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
