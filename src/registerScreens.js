import { Navigation } from 'react-native-navigation';

import FeedComponent from './feed/containers/FeedComponent';
import SearchComponent from './search/SearchComponent';

const registerScreens = (store, Provider) => {
  Navigation.registerComponent('qiitaapp.FeedComponent', () => FeedComponent, store, Provider);
  Navigation.registerComponent('qiitaapp.SearchComponent', () => SearchComponent, store, Provider);
};

export default registerScreens;
