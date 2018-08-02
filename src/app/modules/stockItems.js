import { createAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { qiitaApi } from '../services/qiita-client';
import { parseItems } from '../services/parser';
import { createDefaultReducer } from './utility';

const FETCH_STOCK_ITEMS = 'FETCH_STOCK_ITEMS';
const FETCHED_STOCK_ITEMS = 'FETCHED_STOCK_ITEMS';

const emptyModel = { totalCount: 0, items: [] };
const initialState = {
  loading: false,
  model: emptyModel,
};

const defaultReducer = createDefaultReducer(FETCH_STOCK_ITEMS, FETCHED_STOCK_ITEMS);
export default function reducer(state = initialState, action = {}) {
  return defaultReducer(state, action);
}

export const fetchStockItems = createAction(
  FETCH_STOCK_ITEMS,
  (userId, page = 1, perPage = 20) => ({ userId, page, perPage }),
  (userId, page, perPage, refresh = false) => ({
    refresh,
  }),
);

export const fetchedStockItems = createAction(
  FETCHED_STOCK_ITEMS,
  model => ({ model }),
  (model, refresh) => ({
    refresh,
  }),
);

function* fetchStockItemsTask(action) {
  const { userId, page, perPage } = action.payload;
  const { refresh } = action.meta;
  try {
    const res = yield call(qiitaApi.fetchStockItems, userId, page, perPage);
    const model = parseItems(res);
    yield put(fetchedStockItems(model, refresh));
  } catch (e) {
    yield put(fetchedStockItems(emptyModel, refresh));
  }
}

export function* subscribeFetchStockItem() {
  yield takeLatest(FETCH_STOCK_ITEMS, fetchStockItemsTask);
}
