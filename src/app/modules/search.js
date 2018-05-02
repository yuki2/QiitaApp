import { put, call, takeLatest } from 'redux-saga/effects';
import _ from 'lodash';

import QiitaApi from '../services/QiitaApi';
import { parseItems } from '../services/QiitaApiParser';
import {
  createStartAction,
  createCompleteAction,
  createAbortAction,
  defaultReducer,
} from './utility';

const SEARCH_ITEMS = 'SEARCH_ITEMS';

const initialState = {
  loading: false,
  model: {
    totalCount: 0,
    items: [],
  },
  error: {},
};

export default function reducer(state = initialState, action = {}) {
  return defaultReducer(state, action, SEARCH_ITEMS);
}

export function startSearchItems(query, page = 1, perPage = 20, refresh = false) {
  return createStartAction(SEARCH_ITEMS, {
    query,
    page,
    perPage,
    refresh,
  });
}

export function completeSearchItems(model, refresh) {
  return createCompleteAction(SEARCH_ITEMS, { model }, { refresh });
}

export function abortSearchItems(error) {
  return createAbortAction(SEARCH_ITEMS, { error });
}

function* fetchLatestFeedTask(action) {
  try {
    const {
      query, page, perPage, refresh,
    } = action.payload;
    if (_.isEmpty(query)) {
      yield put(completeSearchItems({ totalCount: 0, items: [] }, refresh));
      return;
    }
    const res = yield call(QiitaApi.fetchItemsByQuery, query, page, perPage);
    const model = parseItems(res);
    yield put(completeSearchItems(model, refresh));
  } catch (e) {
    yield put(abortSearchItems(e));
  }
}

export function* subscribeSearchItems() {
  yield takeLatest((action) => {
    const expected = startSearchItems();
    return action.type === expected.type && action.meta.status === expected.meta.status;
  }, fetchLatestFeedTask);
}
