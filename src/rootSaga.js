import { subscribeFetchLatestItems } from './feed/modules/latestItems';
import { subscribeOpenInAppBrowser } from './common/modules/inAppWebView';
import { subscribeLoginQiita } from './login/modules/session';

export default [subscribeFetchLatestItems, subscribeOpenInAppBrowser, subscribeLoginQiita];
