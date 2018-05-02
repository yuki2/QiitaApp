import { Navigation } from 'react-native-navigation';

import FeedContainer from './app/containers/FeedContainer';
import QiitaItemView from './app/containers/QiitaItemView';
import SearchContainer from './app/containers/SearchContainer';
import LoginContainer from './app/containers/LoginContainer';

const registerScreens = (store, Provider) => {
  Navigation.registerComponent('qiitaapp.FeedContainer', () => FeedContainer, store, Provider);
  Navigation.registerComponent('qiitaapp.SearchContainer', () => SearchContainer, store, Provider);
  Navigation.registerComponent('qiitaapp.Item', () => QiitaItemView, store, Provider);
  Navigation.registerComponent('qiitaapp.LoginContainer', () => LoginContainer, store, Provider);
};

export default registerScreens;
