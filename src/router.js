// @flow
import * as React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import FeedContainer from './app/containers/FeedContainer';
import SearchContainer from './app/containers/SearchContainer';
import LoginContainer from './app/containers/LoginContainer';
import StockContainer from './app/containers/StockContainer';
import { PRIMARY_COLOR } from './app/design';
import { LoginStatus } from './app/modules/session';

export const Login = createStackNavigator(
  {
    Login: { screen: LoginContainer },
  },
  {
    headerMode: 'none',
  },
);

type TabBarIconProps = {
  tintColor: string,
};
const FeedTabBarIcon = ({ tintColor }: TabBarIconProps): React.Element<any> => (
  <Icon name="ios-paper-outline" size={30} color={tintColor} />
);
const StockTabBarIcon = ({ tintColor }: TabBarIconProps): React.Element<any> => (
  <Icon name="ios-folder-open-outline" size={30} color={tintColor} />
);
const SearchTabBarIcon = ({ tintColor }: TabBarIconProps): React.Element<any> => (
  <Icon name="ios-search-outline" size={30} color={tintColor} />
);

export const Tab = createBottomTabNavigator(
  {
    Feed: {
      screen: FeedContainer,
      navigationOptions: {
        tabBarLabel: 'Feed',
        tabBarIcon: FeedTabBarIcon,
      },
    },
    Stock: {
      screen: StockContainer,
      navigationOptions: {
        tabBarLabel: 'Stock',
        tabBarIcon: StockTabBarIcon,
      },
    },
    Search: {
      screen: SearchContainer,
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: SearchTabBarIcon,
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: PRIMARY_COLOR,
    },
  },
);

export const createRootNavigator = (loginStatus: string) =>
  createSwitchNavigator(
    {
      Login: {
        screen: Login,
      },
      Tab: {
        screen: Tab,
      },
    },
    {
      initialRouteName: loginStatus === LoginStatus.NOT_LOGGEDIN ? 'Login' : 'Tab',
    },
  );
