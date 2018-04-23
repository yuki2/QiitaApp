import { put, call, takeLatest } from 'redux-saga/effects';

import { fetchItemsWithQuery } from '../../common/services/QiitaApi';
import { Status } from '../../common/constants';

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
        case Status.PROCESSING:
          return {
            ...state,
            loaded: false,
          };
        case Status.COMPLETE:
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

export function startFetchLatestItems() {
  return { type: FETCH_LATEST_ITEMS, meta: { status: Status.PROCESSING } };
}

export function completeFetchLatestItems({ itemModels }) {
  return { type: FETCH_LATEST_ITEMS, payload: { itemModels }, meta: { status: Status.COMPLETE } };
}

export function abortFetchLatestItems({ error }) {
  return { type: FETCH_LATEST_ITEMS, payload: { error }, meta: { status: Status.ABORT } };
}

function* fetchLatestItemsTask() {
  try {
    const itemModels = yield call(fetchItemsWithQuery);
    yield put(completeFetchLatestItems({ itemModels }));
  } catch (e) {
    yield put(abortFetchLatestItems({ e }));
  }
}

export function* subscribeFetchLatestItems() {
  yield takeLatest((action) => {
    const expected = startFetchLatestItems();
    return action.type === expected.type && action.meta.status === expected.meta.status;
  }, fetchLatestItemsTask);
}
