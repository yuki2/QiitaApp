import { call, put, takeLatest } from 'redux-saga/effects';
import QiitaApi from '../services/QiitaApi';
import { parseItems } from '../services/QiitaApiParser';
import {
  createAbortAction,
  createCompleteAction,
  createStartAction,
  defaultReducer,
  pattern,
} from './utility';

const FETCH_STOCK_ITEMS = 'FETCH_STOCK_ITEMS';

const initialState = {
  loading: false,
  model: {
    totalCount: 0,
    items: [],
  },
  error: {},
};

export default function reducer(state = initialState, action = {}) {
  return defaultReducer(state, action, FETCH_STOCK_ITEMS);
}

export function startFetchStockItems(userId, page = 1, perPage = 20, refresh = false) {
  return createStartAction(FETCH_STOCK_ITEMS, {
    userId,
    page,
    perPage,
    refresh,
  });
}

export function completeFetchStockItems(model, refresh) {
  return createCompleteAction(FETCH_STOCK_ITEMS, { model }, { refresh });
}

export function abortFetchStockItems(error) {
  return createAbortAction(FETCH_STOCK_ITEMS, { error });
}

function* fetchStockItemsTask(action) {
  try {
    const {
      userId, page, perPage, refresh,
    } = action.payload;
    const res = yield call(QiitaApi.fetchStockItems, userId, page, perPage);
    const model = parseItems(res);
    yield put(completeFetchStockItems(model, refresh));
  } catch (e) {
    yield put(abortFetchStockItems(e));
  }
}

export function* subscribeFetchStockItem() {
  yield takeLatest(pattern(startFetchStockItems()), fetchStockItemsTask);
}
