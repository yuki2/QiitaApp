import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import FeedContainer from './app/containers/FeedContainer';
import SearchContainer from './app/containers/SearchContainer';
import LoginContainer from './app/containers/LoginContainer';
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

export const Tab = createBottomTabNavigator(
  {
    Feed: {
      screen: FeedContainer,
      navigationOptions: {
        tabBarLabel: 'Feed',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-paper-outline" size={30} color={tintColor} />
        ),
      },
    },
    Search: {
      screen: SearchContainer,
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-search-outline" size={30} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: PRIMARY_COLOR,
    },
  },
);

export const createRootNavigator = (loginStatus = false) =>
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
