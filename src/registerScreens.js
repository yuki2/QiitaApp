import { Navigation } from 'react-native-navigation';

import FeedComponent from './feed/FeedComponent';
import SearchComponent from './search/SearchComponent';

const registerScreens = () => {
  Navigation.registerComponent('qiitaapp.FeedComponent', () => FeedComponent);
  Navigation.registerComponent('qiitaapp.SearchComponent', () => SearchComponent);
};

export default registerScreens;
