import { put, call, takeLatest } from 'redux-saga/effects';

import QiitaApi from '../../common/services/QiitaApi';
import { parseItems, parseTags } from '../../common/services/QiitaApiParser';
import { Status } from '../../common/constants';

const FETCH_TAG_FEED = 'FETCH_TAG_FEED';

const initialState = {
  loading: true,
  model: {
    totalCount: 0,
    items: [],
  },
  error: {},
};

const uniqueArray = arrArg => arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_TAG_FEED:
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
            newItems = uniqueArray(items);
          } else {
            newItems = uniqueArray(state.model.items.concat(items));
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

export function startFetchTagFeed(userId, page = 1, perPage = 20, refresh = false) {
  return {
    type: FETCH_TAG_FEED,
    payload: {
      userId,
      page,
      perPage,
      refresh,
    },
    meta: { status: Status.PROCESSING },
  };
}

export function completeFetchTagFeed(model, refresh) {
  return {
    type: FETCH_TAG_FEED,
    payload: { model },
    meta: { status: Status.COMPLETE, refresh },
  };
}

export function abortFetchTagFeed(error) {
  return { type: FETCH_TAG_FEED, payload: { error }, meta: { status: Status.ABORT } };
}

function* fetchTagFeedTask(action) {
  try {
    const {
      userId, page, perPage, refresh,
    } = action.payload;
    const followingTagsRes = yield call(QiitaApi.fetchFollowingTags, { userId, page, perPage });
    const tagsModel = parseTags(followingTagsRes);
    const itemsRes = yield call(QiitaApi.fetchItemsByTags, {
      tags: tagsModel.tags.map(tag => tag.id),
      page,
      perPage,
    });
    const model = parseItems(itemsRes);
    yield put(completeFetchTagFeed(model, refresh));
  } catch (e) {
    yield put(abortFetchTagFeed(e));
  }
}

export function* subscribeFetchLatestItems() {
  yield takeLatest((action) => {
    const expected = startFetchTagFeed();
    return action.type === expected.type && action.meta.status === expected.meta.status;
  }, fetchTagFeedTask);
}
