import { subscribeFetchLatestFeed } from './app/modules/latestFeed';
import { subscribeFetchLatestItems } from './app/modules/tagFeed';
import { subscribeOpenInAppBrowser } from './app/modules/inAppWebView';
import { subscribeLoginQiita } from './app/modules/session';

export default [
  subscribeFetchLatestFeed,
  subscribeOpenInAppBrowser,
  subscribeLoginQiita,
  subscribeFetchLatestItems,
];
