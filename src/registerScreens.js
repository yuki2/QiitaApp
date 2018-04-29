import { Navigation } from 'react-native-navigation';

import FeedContainer from './feed/containers/FeedContainer';
import QiitaItemView from './feed/containers/QiitaItemView';
import SearchComponent from './search/SearchComponent';
import LoginContainer from './login/containers/LoginContainer';

const registerScreens = (store, Provider) => {
  Navigation.registerComponent('qiitaapp.FeedContainer', () => FeedContainer, store, Provider);
  Navigation.registerComponent('qiitaapp.SearchComponent', () => SearchComponent, store, Provider);
  Navigation.registerComponent('qiitaapp.Item', () => QiitaItemView, store, Provider);
  Navigation.registerComponent('qiitaapp.LoginContainer', () => LoginContainer, store, Provider);
};

export default registerScreens;
