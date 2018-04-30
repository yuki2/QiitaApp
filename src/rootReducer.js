import { combineReducers } from 'redux';

import latestFeed from './feed/modules/latestFeed';
import tagFeed from './feed/modules/tagFeed';
import session from './login/modules/session';

const rootReducer = combineReducers({
  latestFeed,
  tagFeed,
  session,
});

export default rootReducer;
