import _ from 'lodash';
import { createAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { qiitaApi } from '../services/qiita-client';
import { parseItems } from '../services/parser';
import { createDefaultReducer } from './utility';

const SEARCH_ITEMS = 'SEARCH_ITEMS';
const SEARCHED_ITEMS = 'SEARCHED_ITEMS';

const emptyModel = { totalCount: 0, items: [] };
const initialState = {
  loading: false,
  model: emptyModel,
};

const defaultReducer = createDefaultReducer(SEARCH_ITEMS, SEARCHED_ITEMS);
export default function reducer(state = initialState, action = {}) {
  return defaultReducer(state, action);
}

export const searchItems = createAction(
  SEARCH_ITEMS,
  (query, page = 1, perPage = 20) => ({ query, page, perPage }),
  (query, page, perPage, refresh = false) => ({
    refresh,
  }),
);

export const searchedItems = createAction(
  SEARCHED_ITEMS,
  model => ({ model }),
  (model, refresh) => ({
    refresh,
  }),
);

function* fetchSearchItemsTask(action) {
  const { query, page, perPage } = action.payload;
  const { refresh } = action.meta;
  try {
    if (_.isEmpty(query)) {
      yield put(searchedItems(emptyModel, refresh));
      return;
    }
    const res = yield call(qiitaApi.fetchItemsByQuery, query, page, perPage);
    const model = parseItems(res);
    yield put(searchedItems(model, refresh));
  } catch (e) {
    yield put(searchedItems(emptyModel, refresh));
  }
}

export function* subscribeSearchItems() {
  yield takeLatest(SEARCH_ITEMS, fetchSearchItemsTask);
}
