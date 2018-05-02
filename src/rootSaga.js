import { subscribeFetchLatestFeed } from './app/modules/latestFeed';
import { subscribeFetchLatestItems } from './app/modules/tagFeed';
import { subscribeOpenInAppBrowser } from './app/modules/inAppWebView';
import { subscribeLoginQiita } from './app/modules/session';
import { subscribeSearchItems } from './app/modules/search';

export default [
  subscribeFetchLatestFeed,
  subscribeOpenInAppBrowser,
  subscribeLoginQiita,
  subscribeFetchLatestItems,
  subscribeSearchItems,
];
