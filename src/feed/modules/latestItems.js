import { put, call, takeLatest } from 'redux-saga/effects';

import { fetchItems } from '../../common/services/QiitaApi';
import { Status } from '../../common/constants';

const FETCH_LATEST_ITEMS = 'FETCH_LATEST_ITEMS';

const initialState = {
  loading: true,
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
            loading: true,
          };
        case Status.COMPLETE:
          return {
            ...state,
            itemModels: action.payload.itemModels,
            loading: false,
            error: {},
          };
        case Status.ABORT:
          return {
            ...state,
            loading: false,
            error: action.payload.error,
          };
        default:
          return state;
      }
    default:
      return state;
  }
}

export function startFetchLatestItems(page = 1, perPage = 20) {
  return {
    type: FETCH_LATEST_ITEMS,
    payload: { page, perPage },
    meta: { status: Status.PROCESSING },
  };
}

export function completeFetchLatestItems(itemModels) {
  return { type: FETCH_LATEST_ITEMS, payload: { itemModels }, meta: { status: Status.COMPLETE } };
}

export function abortFetchLatestItems(error) {
  return { type: FETCH_LATEST_ITEMS, payload: { error }, meta: { status: Status.ABORT } };
}

function* fetchLatestItemsTask(action) {
  try {
    const itemModels = yield call(fetchItems, { ...action.payload });
    yield put(completeFetchLatestItems(itemModels));
  } catch (e) {
    yield put(abortFetchLatestItems(e));
  }
}

export function* subscribeFetchLatestItems() {
  yield takeLatest((action) => {
    const expected = startFetchLatestItems();
    return action.type === expected.type && action.meta.status === expected.meta.status;
  }, fetchLatestItemsTask);
}
