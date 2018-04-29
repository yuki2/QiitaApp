import { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import registerScreens from './registerScreens';
import configureStore from './configureStore';

import { LoginStatus, startLoginQiita } from './login/modules/session';

const store = configureStore();
registerScreens(store, Provider);

const navigatorStyle = {
  navBarTranslucent: true,
  drawUnderNavBar: false,
  navBarTextColor: 'white',
  navBarButtonColor: 'white',
  navBarBackgroundColor: '#59BB0C',
  statusBarTextColorScheme: 'light',
  drawUnderTabBar: false,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(startLoginQiita(false));
  }

  onStoreUpdate() {
    const { loginStatus } = store.getState().session;

    // handle a root change
    // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
    if (this.loginStatus !== loginStatus) {
      this.loginStatus = loginStatus;
      this.startApp(loginStatus);
    }
  }

  startLogin = () => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'qiitaapp.LoginContainer',
        title: 'Welcome',
        navigatorStyle: {},
        navigatorButtons: {},
      },
    });
  };

  startTabApp = () => {
    Navigation.startTabBasedApp({
      tabs: [
        {
          label: 'Feed',
          screen: 'qiitaapp.FeedContainer',
          title: 'Feed',
          navigatorStyle,
        },
        {
          label: 'Search',
          screen: 'qiitaapp.SearchComponent',
          title: 'Search',
          navigatorStyle,
        },
      ],
      tabsStyle: {
        tabBarButtonColor: '#59BB0C',
        tabBarSelectedButtonColor: '#59BB0C',
        tabBarBackgroundColor: 'white',
      },
    });
  };

  startApp = (loginStatus) => {
    switch (loginStatus) {
      case LoginStatus.NOT_LOGIN:
        this.startLogin();
        break;
      case LoginStatus.LOGIN:
        this.startTabApp();
        break;
      default:
        break;
    }
  };
}
