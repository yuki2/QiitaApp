import { put, call, take, takeLatest } from 'redux-saga/effects';

import { fetchIcons } from '../services/appIcons';
import { startLoginQiita, completeLoginQiita, abortLoginQiita } from '../modules/session';

import { createStartAction, createCompleteAction, Status, pattern } from './utility';

const INITIALIZE_APPLICATION = 'INITIALIZE_APPLICATION';

export function startInitializeApplication() {
  return createStartAction(INITIALIZE_APPLICATION, null, null);
}

export function completeInitializeApplication() {
  return createCompleteAction(INITIALIZE_APPLICATION, null, null);
}

const initialState = {
  completed: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INITIALIZE_APPLICATION:
      switch (action.meta.status) {
        case Status.PROCESSING:
          return {
            ...state,
            completed: false,
          };
        case Status.COMPLETE:
          return {
            ...state,
            completed: true,
          };
        default:
          return state;
      }
    default:
      return state;
  }
}

function* initializeApplicationTask() {
  try {
    yield call(fetchIcons);
    yield put(startLoginQiita(false));
    yield take([pattern(completeLoginQiita()), pattern(abortLoginQiita())]);
    yield put(completeInitializeApplication());
  } catch (e) {
    yield put(completeInitializeApplication());
  }
}

export function* subscribeIitializeApplication() {
  yield takeLatest(pattern(startInitializeApplication()), initializeApplicationTask);
}
