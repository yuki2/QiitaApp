import { createAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import QiitaApi from '../services/QiitaApi';
import { parseItems } from '../services/QiitaApiParser';
import { uniqueItems } from './utility';

const FETCH_LATEST_FEED = 'FETCH_LATEST_FEED';
const FETCHED_LATEST_FEED = 'FETCHED_LATEST_FEED';

const initialState = {
  loading: false,
  model: {
    totalCount: 0,
    items: [],
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_LATEST_FEED:
      return {
        ...state,
        loading: true,
      };
    case FETCHED_LATEST_FEED: {
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
      };
    }
    default:
      return state;
  }
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
    const res = yield call(QiitaApi.fetchItems, page, perPage);
    const model = parseItems(res);
    yield put(fetchedLatestFeed(model, refresh));
  } catch (e) {
    yield put(fetchedLatestFeed({}, refresh));
  }
}

export function* subscribeFetchLatestFeed() {
  yield takeLatest(FETCH_LATEST_FEED, fetchLatestFeedTask);
}
