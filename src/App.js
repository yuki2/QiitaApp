import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import registerScreens from './registerScreens';
import configureStore from './configureStore';

const store = configureStore();
registerScreens(store, Provider);

const navigatorStyle = {
  navBarTranslucent: true,
  drawUnderNavBar: true,
  navBarTextColor: 'white',
  navBarButtonColor: 'white',
  statusBarTextColorScheme: 'light',
  drawUnderTabBar: true,
};

Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'Feed',
      screen: 'qiitaapp.FeedComponent',
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
    tabBarButtonColor: 'white',
    tabBarSelectedButtonColor: 'white',
    tabBarBackgroundColor: 'black',
  },
});
