import { createAction } from 'redux-actions';
import { put, take, takeLatest } from 'redux-saga/effects';
import { abortLoginQiita, completeLoginQiita, startLoginQiita } from '../modules/session';
import { pattern } from './utility';

const INITIALIZE_APPLICATION = 'INITIALIZE_APPLICATION';
const INITIALIZED_APPLICATION = 'INITIALIZED_APPLICATION';

export const initializeApplication = createAction(INITIALIZE_APPLICATION);

export const initializedApplication = createAction(INITIALIZED_APPLICATION);

const initialState = {
  completed: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INITIALIZE_APPLICATION:
      return { completed: false };
    case INITIALIZED_APPLICATION:
      return { completed: true };
    default:
      return state;
  }
}

function* initializeApplicationTask() {
  try {
    yield put(startLoginQiita(false));
    yield take([pattern(completeLoginQiita()), pattern(abortLoginQiita())]);
    yield put(initializedApplication());
  } catch (e) {
    yield put(initializedApplication());
  }
}

export function* subscribeIitializeApplication() {
  yield takeLatest(INITIALIZE_APPLICATION, initializeApplicationTask);
}
