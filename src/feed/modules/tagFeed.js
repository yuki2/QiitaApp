import { put, call, takeLatest, all } from 'redux-saga/effects';

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

function* fetchItemsByTags({ tags, page, perPage }) {
  const tasks = tags.map(tag =>
    call(QiitaApi.fetchItemsByTag, {
      tag,
      page,
      perPage,
    }));

  const responseArray = yield all(tasks);
  const itemModels = responseArray.map(response => parseItems(response));
  const items = itemModels
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue.items), [])
    .sort((lItem, rItem) => rItem.createdAt - lItem.createdAt);
  const totalCount = itemModels.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalCount,
    0,
  );
  return { totalCount, items };
}

function* fetchTagFeedTask(action) {
  try {
    const {
      userId, page, perPage, refresh,
    } = action.payload;
    const followingTagsRes = yield call(QiitaApi.fetchFollowingTags, { userId, page, perPage });
    const tagsModel = parseTags(followingTagsRes);
    const model = yield call(fetchItemsByTags, {
      tags: tagsModel.tags.map(tag => tag.id),
      page,
      perPage,
    });
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
