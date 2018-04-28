import { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import registerScreens from './registerScreens';
import configureStore from './configureStore';

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
    this.startApp();
  }

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

  startApp = () => {
    this.startTabApp();
  };
}
