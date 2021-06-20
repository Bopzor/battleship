import { createServer, Server } from 'http';
import { Container } from 'inversify';

import { GameRepository } from '../domain/Game';
import { GameService } from '../domain/GameService';
import { GameEvent, Notifier, NotifierSymbol } from '../domain/Notifier';
import { PlayerRepository, PlayerRepositorySymbol } from '../domain/Player';
import { InMemoryGameRepository } from '../test/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../test/InMemoryPlayerRepository';

import { GameRepositorySymbol, HttpServerSymbol, WebSocketServer } from './WebSocketServer';

class WebSocketNotifier implements Notifier {
  socketServer?: WebSocketServer;

  notify(event: GameEvent): void {
    if (!this.socketServer) {
      throw new Error('WebSocketNotifier.socketServer is not set.');
    }

    this.socketServer.notify(event);
  }
}

export const bootstrap = () => {
  const container = new Container();
  const server = createServer();
  const notifier = new WebSocketNotifier();

  container.bind<Server>(HttpServerSymbol).toConstantValue(server);

  container.bind<GameRepository>(GameRepositorySymbol).to(InMemoryGameRepository);
  container.bind<PlayerRepository>(PlayerRepositorySymbol).to(InMemoryPlayerRepository);
  container.bind<GameService>(GameService).to(GameService);
  container.bind<WebSocketServer>(WebSocketServer).to(WebSocketServer);
  container.bind<Notifier>(NotifierSymbol).toConstantValue(notifier);

  notifier.socketServer = container.get(WebSocketServer);

  return server;
};
