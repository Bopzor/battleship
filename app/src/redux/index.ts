import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import { AppState } from './AppState';
import { rootReducer } from './reducers';
import { AppActions, Dependencies } from './types';

export const configureStore = (dependencies: Dependencies) => {
  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument(dependencies) as ThunkMiddleware<
          AppState,
          AppActions,
          Dependencies
        >,
      ),
    ),
  );
};
