import { combineReducers } from 'redux';

import latestItems from './feed/modules/latestItems';

const rootReducer = combineReducers({
  latestItems,
});

export default rootReducer;
