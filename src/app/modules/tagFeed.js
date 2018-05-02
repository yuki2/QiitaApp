import { put, call, takeLatest, all } from 'redux-saga/effects';

import QiitaApi from '../services/QiitaApi';
import { parseItems, parseTags } from '../services/QiitaApiParser';
import {
  createStartAction,
  createCompleteAction,
  createAbortAction,
  defaultReducer,
} from './utility';

const FETCH_TAG_FEED = 'FETCH_TAG_FEED';

const initialState = {
  loading: false,
  model: {
    totalCount: 0,
    items: [],
  },
  error: {},
};

export default function reducer(state = initialState, action = {}) {
  return defaultReducer(state, action, FETCH_TAG_FEED);
}

export function startFetchTagFeed(userId, page = 1, perPage = 20, refresh = false) {
  return createStartAction(FETCH_TAG_FEED, {
    userId,
    page,
    perPage,
    refresh,
  });
}

export function completeFetchTagFeed(model, refresh) {
  return createCompleteAction(FETCH_TAG_FEED, { model }, { refresh });
}

export function abortFetchTagFeed(error) {
  return createAbortAction(FETCH_TAG_FEED, { error });
}

function* fetchItemsByTags({ tags, page, perPage }) {
  const tasks = tags.map(tag => call(QiitaApi.fetchItemsByTag, tag, page, perPage));

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
    const followingTagsRes = yield call(QiitaApi.fetchFollowingTags, userId, page, perPage);
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
