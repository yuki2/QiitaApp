import { subscribeFetchLatestItems } from './feed/modules/latestItems';
import { subscribeOpenInAppBrowser } from './feed/modules/inAppWebView';

export default [subscribeFetchLatestItems, subscribeOpenInAppBrowser];
