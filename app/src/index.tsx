import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';

import App from './App';
import { gameFetched } from './domain/use-cases/get-game';
import { Ship, shipPlaced } from './domain/use-cases/select-cell';
import { InMemoryBattleshipGateway } from './infrastructure/gateways/in-mem-battleship-gateway';
import { configureStore } from './redux';

const store = configureStore({
  battleshipGateway: new InMemoryBattleshipGateway(),
});

store.dispatch(gameFetched({ boardSize: 10, requiredShipsSizes: [1, 1, 2, 3, 3, 4] }));
store.dispatch(shipPlaced(new Ship({ x: 1, y: 2 }, 'horizontal', 3)));

ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.getElementById('app'),
);
