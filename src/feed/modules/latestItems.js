import keyMirror from 'keymirror';
import { put, call, takeLatest } from 'redux-saga/effects';

import { fetchItemsWithQuery } from '../../common/services/QiitaApi';

const STATUS = keyMirror({ processing: null, complete: null, abort: null });

const FETCH_LATEST_ITEMS = 'FETCH_LATEST_ITEMS';

const initialState = {
  loaded: false,
  itemModels: [],
  error: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_LATEST_ITEMS:
      switch (action.meta.status) {
        case STATUS.complete:
          return {
            ...state,
            itemModels: action.payload.itemModels,
            loaded: true,
            error: {},
          };
        default:
          return state;
      }
    default:
      return state;
  }
}

export function fetchLatestItemsStart() {
  return { type: FETCH_LATEST_ITEMS, meta: { status: STATUS.processing } };
}

export function fetchLatestItemsCompleted({ itemModels }) {
  return { type: FETCH_LATEST_ITEMS, payload: { itemModels }, meta: { status: STATUS.complete } };
}

export function fetchLatestItemsAborted({ error }) {
  return { type: FETCH_LATEST_ITEMS, payload: { error }, meta: { status: STATUS.abort } };
}

function* fetchLatestItemsTask() {
  try {
    const itemModels = yield call(fetchItemsWithQuery);
    yield put(fetchLatestItemsCompleted({ itemModels }));
  } catch (e) {
    yield put(fetchLatestItemsAborted({ e }));
  }
}

export function* subscribeFetchLatestItems() {
  yield takeLatest((action) => {
    const expected = fetchLatestItemsStart();
    return action.type === expected.type && action.meta.status === expected.meta.status;
  }, fetchLatestItemsTask);
}
