import { subscribeFetchLatestFeed } from './app/modules/latestFeed';
import { subscribeFetchLatestItems } from './app/modules/tagFeed';
import { subscribeOpenInAppBrowser } from './app/modules/inAppBrowser';
import { subscribeSession } from './app/modules/session';
import { subscribeSearchItems } from './app/modules/search';
import { subscribeIitializeApplication } from './app/modules/initialization';
import { subscribeFetchStockItem } from './app/modules/stockItems';

export default [
  subscribeFetchLatestFeed,
  subscribeOpenInAppBrowser,
  subscribeSession,
  subscribeFetchLatestItems,
  subscribeSearchItems,
  subscribeIitializeApplication,
  subscribeFetchStockItem,
];
