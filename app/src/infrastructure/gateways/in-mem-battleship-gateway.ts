import {
  BattleshipEvent,
  BattleshipGateway,
  MessageHandler,
} from '../../domain/gateways/battleship-gateway';
import { ShotResult } from '../../redux/AppState';
import { AsyncResult } from '../../shared/AsyncResult';

export class InMemoryBattleshipGateway implements BattleshipGateway {
  private _serverConnection = new AsyncResult();

  resolveConnectToServer = this._serverConnection.resolve;
  rejectConnectToServer = this._serverConnection.reject;
  connectToServer = this._serverConnection.register;

  private _handlers: MessageHandler[] = [];

  registerMessageHandler(handler: MessageHandler) {
    this._handlers.push(handler);
  }

  sendEvent(event: BattleshipEvent) {
    this._handlers.forEach((handler) => handler(event));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async setNick() {}

  private _shootResult = new AsyncResult<ShotResult>();

  resolveShoot = this._shootResult.resolve;
  rejectShoot = this._shootResult.reject;
  shoot = this._shootResult.register;
}
