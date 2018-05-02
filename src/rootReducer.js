import { combineReducers } from 'redux';

import latestFeed from './app/modules/latestFeed';
import tagFeed from './app/modules/tagFeed';
import session from './app/modules/session';

const rootReducer = combineReducers({
  latestFeed,
  tagFeed,
  session,
});

export default rootReducer;
