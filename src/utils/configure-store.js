/* eslint-disable global-require */

/* global __DEVTOOLS__ */
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import logger from '../middleware/logger';
import persistenceStore from '../persistence/store';
import * as reducers from '../reducers';

const storeEnhancers = [
  persistenceStore,
];

if (__DEVTOOLS__) {
  const DevTools = require('../components/common/DevTools/DevTools').default;
  storeEnhancers.push(DevTools.instrument());
}

const finalCreateStore = compose(
  applyMiddleware(thunk, logger),
  ...storeEnhancers
)(createStore);

const combinedReducer = combineReducers(Object.assign({
  form: formReducer,
}, reducers));

export default function configureStore(initialState) {
  const store = finalCreateStore(combinedReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
