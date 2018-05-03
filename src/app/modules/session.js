import { AsyncStorage } from 'react-native';
import { put, call, takeLatest } from 'redux-saga/effects';
import keyMirror from 'keymirror';
import Config from 'react-native-config';
import _ from 'lodash';

import {
  Status,
  createStartAction,
  createCompleteAction,
  createAbortAction,
  pattern,
} from './utility';
import QiitaApi from '../services/QiitaApi';

const LOGIN_QIITA = 'LOGIN_QIITA';

export const LoginStatus = keyMirror({
  UNKNOWN: null,
  NOT_LOGGEDIN: null,
  LOGGEDIN_AS_USER: null,
  LOGGEDIN_AS_GUEST: null,
});

export function startLoginQiita(requiredUI = true) {
  return createStartAction(LOGIN_QIITA, { requiredUI }, null);
}

export function completeLoginQiita(myUser, loginStatus) {
  return createCompleteAction(LOGIN_QIITA, { myUser, loginStatus }, null);
}

export function abortLoginQiita(error) {
  return createAbortAction(LOGIN_QIITA, { error }, null);
}

const initialState = {
  loading: false,
  loginStatus: LoginStatus.UNKNOWN,
  myUser: {},
  error: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_QIITA:
      switch (action.meta.status) {
        case Status.PROCESSING:
          return {
            ...state,
            loading: true,
          };
        case Status.COMPLETE:
          return {
            ...state,
            myUser: action.payload.myUser,
            loginStatus: action.payload.loginStatus,
            loading: false,
            error: {},
          };
        case Status.ABORT:
          return {
            myUser: {},
            loginStatus: LoginStatus.NOT_LOGGEDIN,
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

function getSession() {
  return AsyncStorage.getItem('session').then(res => JSON.parse(res));
}

function setSession(sessionModel) {
  return AsyncStorage.setItem('session', JSON.stringify(sessionModel));
}

function* loginQiitaTask(action) {
  try {
    const { requiredUI } = action.payload;
    if (requiredUI) {
      if (_.isEmpty(Config.CLIENT_ID) || _.isEmpty(Config.CLIENT_SECRET)) {
        // eslint-disable-next-line no-console
        console.error('You must define CLIENT_ID and CLIENT_SECRET at .env file');
        return; // TODO throw
      }
      const { code } = yield call(QiitaApi.fetchCode);
      const { token } = yield call(QiitaApi.fetchAccessToken, code);
      yield call(setSession, { token });
      QiitaApi.token = token;
    } else {
      const { token } = yield call(getSession);
      QiitaApi.token = token;
    }
    const authenticatedUser = yield call(QiitaApi.fetchAuthenticatedUser);
    yield put(completeLoginQiita(authenticatedUser, LoginStatus.LOGGEDIN_AS_USER));
  } catch (e) {
    console.log(e);
    yield put(abortLoginQiita(e));
  }
}

export function* subscribeLoginQiita() {
  yield takeLatest(pattern(startLoginQiita()), loginQiitaTask);
}
