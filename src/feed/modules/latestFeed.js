import { put, call, takeLatest } from 'redux-saga/effects';

import QiitaApi from '../../common/services/QiitaApi';
import { parseItems } from '../../common/services/QiitaApiParser';
import { Status } from '../../common/constants';

const FETCH_LATEST_FEED = 'FETCH_LATEST_FEED';

const initialState = {
  loading: true,
  model: {
    totalCount: 0,
    items: [],
  },
  error: {},
};

/* eslint-disable prefer-const */
const uniqueItems = (items) => {
  let uniqueIds = new Set();
  let newItems = [];
  items.forEach((item) => {
    if (uniqueIds.has(item.id)) {
      return;
    }
    uniqueIds.add(item.id);
    newItems.push(item);
  });
  return newItems;
};
/* eslint-disable prefer-const */

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_LATEST_FEED:
      switch (action.meta.status) {
        case Status.PROCESSING:
          return {
            ...state,
            loading: true,
          };
        case Status.COMPLETE: {
          const { items, totalCount } = action.payload.model;
          let newItems;
          if (action.meta.refresh) {
            newItems = uniqueItems(items);
          } else {
            newItems = uniqueItems(state.model.items.concat(items));
          }

          return {
            ...state,
            model: {
              totalCount,
              items: newItems,
            },
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

export function startFetchLatestFeed(page = 1, perPage = 20, refresh = false) {
  return {
    type: FETCH_LATEST_FEED,
    payload: { page, perPage, refresh },
    meta: { status: Status.PROCESSING },
  };
}

export function completeFetchLatestFeed(model, refresh) {
  return {
    type: FETCH_LATEST_FEED,
    payload: { model },
    meta: { status: Status.COMPLETE, refresh },
  };
}

export function abortFetchLatestFeed(error) {
  return { type: FETCH_LATEST_FEED, payload: { error }, meta: { status: Status.ABORT } };
}

function* fetchLatestFeedTask(action) {
  try {
    const { page, perPage, refresh } = action.payload;
    const res = yield call(QiitaApi.fetchItems, { page, perPage });
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
