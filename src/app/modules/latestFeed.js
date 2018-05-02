import { put, call, takeLatest } from 'redux-saga/effects';

import QiitaApi from '../services/QiitaApi';
import { parseItems } from '../services/QiitaApiParser';
import {
  createStartAction,
  createCompleteAction,
  createAbortAction,
  defaultReducer,
} from './utility';

const FETCH_LATEST_FEED = 'FETCH_LATEST_FEED';

const initialState = {
  loading: true,
  model: {
    totalCount: 0,
    items: [],
  },
  error: {},
};

export default function reducer(state = initialState, action = {}) {
  return defaultReducer(state, action, FETCH_LATEST_FEED);
}

export function startFetchLatestFeed(page = 1, perPage = 20, refresh = false) {
  return createStartAction(FETCH_LATEST_FEED, { page, perPage, refresh });
}

export function completeFetchLatestFeed(model, refresh) {
  return createCompleteAction(FETCH_LATEST_FEED, { model }, { refresh });
}

export function abortFetchLatestFeed(error) {
  return createAbortAction(FETCH_LATEST_FEED, { error });
}

function* fetchLatestFeedTask(action) {
  try {
    const { page, perPage, refresh } = action.payload;
    const res = yield call(QiitaApi.fetchItems, page, perPage);
    const model = parseItems(res);
    yield put(completeFetchLatestFeed(model, refresh));
  } catch (e) {
    yield put(abortFetchLatestFeed(e));
  }
}

export function* subscribeFetchLatestFeed() {
  yield takeLatest((action) => {
    const expected = startFetchLatestFeed();
    return action.type === expected.type && action.meta.status === expected.meta.status;
  }, fetchLatestFeedTask);
}
