import { createAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { qiitaApi } from '../services/qiita-client';
import { parseItems } from '../services/parser';
import { createDefaultReducer } from './utility';

const FETCH_LATEST_FEED = 'FETCH_LATEST_FEED';
const FETCHED_LATEST_FEED = 'FETCHED_LATEST_FEED';

const initialState = {
  loading: false,
  model: {
    totalCount: 0,
    items: [],
  },
};

const defaultReducer = createDefaultReducer(FETCH_LATEST_FEED, FETCHED_LATEST_FEED);
export default function reducer(state = initialState, action = {}) {
  return defaultReducer(state, action);
}

export const fetchLatestFeed = createAction(
  FETCH_LATEST_FEED,
  (page = 1, perPage = 20) => ({ page, perPage }),
  (page, perPage, refresh = false) => ({
    refresh,
  }),
);

export const fetchedLatestFeed = createAction(
  FETCHED_LATEST_FEED,
  model => ({ model }),
  (model, refresh) => ({
    refresh,
  }),
);

function* fetchLatestFeedTask(action) {
  const { page, perPage } = action.payload;
  const { refresh } = action.meta;
  try {
    const res = yield call(qiitaApi.fetchItems, page, perPage);
    const model = parseItems(res);
    yield put(fetchedLatestFeed(model, refresh));
  } catch (e) {
    yield put(fetchedLatestFeed({}, refresh));
  }
}

export function* subscribeFetchLatestFeed() {
  yield takeLatest(FETCH_LATEST_FEED, fetchLatestFeedTask);
}
