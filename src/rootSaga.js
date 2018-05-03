import { subscribeFetchLatestFeed } from './app/modules/latestFeed';
import { subscribeFetchLatestItems } from './app/modules/tagFeed';
import { subscribeOpenInAppBrowser } from './app/modules/inAppBrowser';
import { subscribeLoginQiita } from './app/modules/session';
import { subscribeSearchItems } from './app/modules/search';
import { subscribeIitializeApplication } from './app/modules/initialization';
import { subscribeFetchStockItem } from './app/modules/stockItems';

export default [
  subscribeFetchLatestFeed,
  subscribeOpenInAppBrowser,
  subscribeLoginQiita,
  subscribeFetchLatestItems,
  subscribeSearchItems,
  subscribeIitializeApplication,
  subscribeFetchStockItem,
];
