import { subscribeFetchLatestItems } from './feed/modules/latestItems';
import { subscribeOpenInAppBrowser } from './common/modules/inAppWebView';

export default [subscribeFetchLatestItems, subscribeOpenInAppBrowser];
