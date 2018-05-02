import { combineReducers } from 'redux';

import latestFeed from './app/modules/latestFeed';
import tagFeed from './app/modules/tagFeed';
import session from './app/modules/session';
import search from './app/modules/search';

const rootReducer = combineReducers({
  latestFeed,
  tagFeed,
  session,
  search,
});

export default rootReducer;
