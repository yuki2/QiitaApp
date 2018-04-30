import { combineReducers } from 'redux';

import latestFeed from './feed/modules/latestFeed';
import session from './login/modules/session';

const rootReducer = combineReducers({
  latestFeed,
  session,
});

export default rootReducer;
