import { subscribeFetchLatestFeed } from './feed/modules/latestFeed';
import { subscribeOpenInAppBrowser } from './common/modules/inAppWebView';
import { subscribeLoginQiita } from './login/modules/session';

export default [subscribeFetchLatestFeed, subscribeOpenInAppBrowser, subscribeLoginQiita];
