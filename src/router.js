import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { StackNavigator, TabNavigator, SwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import FeedContainer from './app/containers/FeedContainer';
import SearchContainer from './app/containers/SearchContainer';
import LoginContainer from './app/containers/LoginContainer';
import { PRIMARY_COLOR } from './app/design';
import { LoginStatus } from './app/modules/session';

export const Login = StackNavigator(
  {
    Login: { screen: LoginContainer },
  },
  {
    headerMode: 'none',
  },
);

export const Tab = TabNavigator(
  {
    Home: {
      screen: FeedContainer,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-paper-outline" size={30} color={tintColor} />
        ),
      },
    },
    Profile: {
      screen: SearchContainer,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-search-outline" size={30} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: PRIMARY_COLOR,
      style: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      },
    },
  },
);

export const createRootNavigator = (loginStatus = false) =>
  SwitchNavigator(
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
