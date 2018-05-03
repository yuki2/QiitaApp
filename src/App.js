// @flow
import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';

import { startInitializeApplication } from './app/modules/initialization';

import './ReactotronConfig';
import configureStore from './configureStore';
import { createRootNavigator } from './router';

const mapStateToProps = state => ({
  loginStatus: state.session.loginStatus,
  completed: state.initialization.completed,
});

const mapDispatchToProps = dispatch => ({
  initializeApplication: () => {
    dispatch(startInitializeApplication());
  },
});

type Props = {
  initializeApplication: () => void,
  completed: boolean,
  loginStatus: any,
};
class App extends Component<Props> {
  componentDidMount() {
    const { initializeApplication } = this.props;
    initializeApplication();
  }

  render() {
    const { completed, loginStatus } = this.props;
    if (!completed) {
      return null;
    }
    const Layout = createRootNavigator(loginStatus);
    return <Layout />;
  }
}

const RootNavigationStack = connect(mapStateToProps, mapDispatchToProps)(App);

const store = configureStore();
const Root = () => (
  <Provider store={store}>
    <RootNavigationStack />
  </Provider>
);

export default Root;
