import { createAction } from 'redux-actions';
import { put, take, takeLatest } from 'redux-saga/effects';
import { login, LOGGED_IN, LOGGED_OUT } from '../modules/session';

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
    yield put(login(false));
    yield take([LOGGED_IN, LOGGED_OUT]);
    yield put(initializedApplication());
  } catch (e) {
    yield put(initializedApplication());
  }
}

export function* subscribeIitializeApplication() {
  yield takeLatest(INITIALIZE_APPLICATION, initializeApplicationTask);
}
