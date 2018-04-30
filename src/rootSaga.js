import { subscribeFetchLatestFeed } from './feed/modules/latestFeed';
import { subscribeFetchLatestItems } from './feed/modules/tagFeed';
import { subscribeOpenInAppBrowser } from './common/modules/inAppWebView';
import { subscribeLoginQiita } from './login/modules/session';

export default [
  subscribeFetchLatestFeed,
  subscribeOpenInAppBrowser,
  subscribeLoginQiita,
  subscribeFetchLatestItems,
];
