import { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import './ReactotronConfig';
import registerScreens from './registerScreens';
import configureStore from './configureStore';
import { PRIMARY_COLOR } from './app/design';
import { LoginStatus, startLoginQiita } from './app/modules/session';
import { iconsMap, iconsLoaded } from './app/services/appIcons';

import rssIcon from './assets/rss.png';
import searchIcon from './assets/search.png';

const store = configureStore();
registerScreens(store, Provider);

export default class App extends Component {
  constructor(props) {
    super(props);
    store.subscribe(this.onStoreUpdate.bind(this));
    iconsLoaded.then(() => {
      store.dispatch(startLoginQiita(false));
    });
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
        navigatorStyle: {
          navBarHidden: true,
        },
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
          icon: iconsMap['ios-paper-outline'],
          navigatorStyle: {
            navBarHidden: true,
          },
        },
        {
          label: 'Search',
          screen: 'qiitaapp.SearchContainer',
          title: 'Search',
          icon: iconsMap['ios-search-outline'],
          navigatorStyle: {
            navBarHidden: true,
          },
        },
      ],
      tabsStyle: {
        tabBarSelectedButtonColor: PRIMARY_COLOR,
        tabBarBackgroundColor: 'white',
      },
    });
  };

  startApp = (loginStatus) => {
    switch (loginStatus) {
      case LoginStatus.NOT_LOGGEDIN:
        this.startLogin();
        break;
      case LoginStatus.LOGGEDIN_AS_USER:
        this.startTabApp();
        break;
      default:
        break;
    }
  };
}
