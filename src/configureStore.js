import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import app from './rootReducer';
import rootSaga from './rootSaga';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    // eslint-disable-next-line global-require
    const reactotron = require('reactotron-react-native').default;
    const sagaMonitor = reactotron.createSagaMonitor();
    const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
    const store = reactotron.createStore(app, composeEnhancers(applyMiddleware(sagaMiddleware)));
    rootSaga.map(saga => sagaMiddleware.run(saga));
    return store;
  }
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(app, composeEnhancers(applyMiddleware(sagaMiddleware)));
  rootSaga.map(saga => sagaMiddleware.run(saga));
  return store;
}
