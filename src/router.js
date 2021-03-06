// @flow
import * as React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import LatestFeedContainer from './app/containers/LatestFeedContainer';
import LoginContainer from './app/containers/LoginContainer';
import SearchContainer from './app/containers/SearchContainer';
import StockContainer from './app/containers/StockContainer';
import TagFeedContainer from './app/containers/TagFeedContainer';
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

export const FeedTopTab = createMaterialTopTabNavigator(
  {
    Latest: {
      screen: LatestFeedContainer,
      navigationOptions: {
        tabBarLabel: 'Latest',
      },
    },
    TagFeed: {
      screen: TagFeedContainer,
      navigationOptions: {
        tabBarLabel: 'TagFeed',
      },
    },
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: PRIMARY_COLOR,
        ...Platform.select({
          ios: {
            paddingTop: 20,
          },
        }),
      },
    },
  },
);

export const Tab = createBottomTabNavigator(
  {
    Feed: {
      screen: FeedTopTab,
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
