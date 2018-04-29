import { combineReducers } from 'redux';

import latestItems from './feed/modules/latestItems';
import session from './login/modules/session';

const rootReducer = combineReducers({
  latestItems,
  session,
});

export default rootReducer;
