import { Navigation } from 'react-native-navigation';
import registerScreens from './registerScreens';

const navigatorStyle = {
  navBarTranslucent: true,
  drawUnderNavBar: true,
  navBarTextColor: 'white',
  navBarButtonColor: 'white',
  statusBarTextColorScheme: 'light',
  drawUnderTabBar: true,
};

registerScreens();

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
