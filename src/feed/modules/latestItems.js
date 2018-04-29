import { put, call, takeLatest } from 'redux-saga/effects';

import QiitaApi from '../../common/services/QiitaApi';
import { Status } from '../../common/constants';

const FETCH_LATEST_ITEMS = 'FETCH_LATEST_ITEMS';

const initialState = {
  loading: true,
  itemModels: [],
  error: {},
};

const uniqueArray = arrArg => arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

const parseItem = item => ({
  id: item.id,
  title: item.title,
  url: item.url,
  user: item.user,
  tags: item.tags,
  createdAt: item.created_at,
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_LATEST_ITEMS:
      switch (action.meta.status) {
        case Status.PROCESSING:
          return {
            ...state,
            loading: true,
          };
        case Status.COMPLETE: {
          let itemModels;
          if (action.meta.refresh) {
            itemModels = uniqueArray(action.payload.itemModels);
          } else {
            itemModels = uniqueArray(state.itemModels.concat(action.payload.itemModels));
          }
          return {
            ...state,
            itemModels,
            loading: false,
            error: {},
          };
        }
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

export function startFetchLatestItems(page = 1, perPage = 20, refresh = false) {
  return {
    type: FETCH_LATEST_ITEMS,
    payload: { page, perPage, refresh },
    meta: { status: Status.PROCESSING },
  };
}

export function completeFetchLatestItems(itemModels, refresh) {
  return {
    type: FETCH_LATEST_ITEMS,
    payload: { itemModels },
    meta: { status: Status.COMPLETE, refresh },
  };
}

export function abortFetchLatestItems(error) {
  return { type: FETCH_LATEST_ITEMS, payload: { error }, meta: { status: Status.ABORT } };
}

function* fetchLatestItemsTask(action) {
  try {
    const { page, perPage, refresh } = action.payload;
    const res = yield call(QiitaApi.fetchItems, { page, perPage });
    yield put(completeFetchLatestItems(res.map(r => parseItem(r)), refresh));
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
