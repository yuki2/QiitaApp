import { combineReducers } from 'redux';

import latestFeed from './app/modules/latestFeed';
import tagFeed from './app/modules/tagFeed';
import session from './app/modules/session';
import search from './app/modules/search';
import initialization from './app/modules/initialization';
import stockItems from './app/modules/stockItems';

const rootReducer = combineReducers({
  latestFeed,
  tagFeed,
  session,
  search,
  initialization,
  stockItems,
});

export default rootReducer;
