import { createAction } from 'redux-actions';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { qiitaApi } from '../services/qiita-client';
import { parseItems, parseTags } from '../services/parser';
import { createDefaultReducer } from './utility';

const FETCH_TAG_FEED = 'FETCH_TAG_FEED';
const FETCHED_TAG_FEED = 'FETCHED_TAG_FEED';

const emptyModel = { totalCount: 0, items: [] };
const initialState = {
  loading: false,
  model: emptyModel,
};

const defaultReducer = createDefaultReducer(FETCH_TAG_FEED, FETCHED_TAG_FEED);
export default function reducer(state = initialState, action = {}) {
  return defaultReducer(state, action);
}

export const fetchTagFeed = createAction(
  FETCH_TAG_FEED,
  (userId, page = 1, perPage = 20) => ({ userId, page, perPage }),
  (userId, page, perPage, refresh = false) => ({
    refresh,
  }),
);

export const fetchedTagFeed = createAction(
  FETCHED_TAG_FEED,
  model => ({ model }),
  (model, refresh) => ({
    refresh,
  }),
);

function* fetchItemsByTags({ tags, page, perPage }) {
  const tasks = tags.map(tag => call(qiitaApi.fetchItemsByTag, tag, page, perPage));

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
  const { userId, page, perPage } = action.payload;
  const { refresh } = action.meta;
  try {
    const followingTagsRes = yield call(qiitaApi.fetchFollowingTags, userId, page, perPage);
    const tagsModel = parseTags(followingTagsRes);
    const model = yield call(fetchItemsByTags, {
      tags: tagsModel.tags.map(tag => tag.id),
      page,
      perPage,
    });
    yield put(fetchedTagFeed(model, refresh));
  } catch (e) {
    yield put(fetchedTagFeed(emptyModel, refresh));
  }
}

export function* subscribeFetchLatestItems() {
  yield takeLatest(FETCH_TAG_FEED, fetchTagFeedTask);
}
