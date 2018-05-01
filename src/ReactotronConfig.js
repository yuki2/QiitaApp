// eslint-disable-next-line no-undef
if (__DEV__) {
  /* eslint-disable global-require */
  const reactotron = require('reactotron-react-native').default;
  const { reactotronRedux } = require('reactotron-redux');
  const sagaPlugin = require('reactotron-redux-saga');
  /* eslint-disable global-require */
  reactotron
    .configure({ name: 'QiitaApp' })
    .use(reactotronRedux())
    .use(sagaPlugin())
    .connect();
}
