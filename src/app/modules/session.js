import { Platform, NativeModules, AsyncStorage } from 'react-native';
import { put, call, takeLatest } from 'redux-saga/effects';
import keyMirror from 'keymirror';
import Config from 'react-native-config';
import _ from 'lodash';

import { Status, createStartAction, createCompleteAction, createAbortAction } from './utility';
import QiitaApi from '../services/QiitaApi';

const oAuthSession = Platform.select({
  ios: NativeModules.OAuthSession,
});

const LOGIN_QIITA = 'LOGIN_QIITA';

export const LoginStatus = keyMirror({
  UNKNOWN: null,
  NOT_LOGGEDIN: null,
  LOGGEDIN_AS_USER: null,
  LOGGEDIN_AS_GUEST: null,
});

export function startLoginQiita(requiredUI) {
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

function fetchAccessToken(code) {
  return QiitaApi.fetchAccessToken(Config.CLIENT_ID, Config.CLIENT_SECRET, code);
}

const AUTH_URL = 'https://qiita.com/api/v2/oauth/authorize';
const SCOPES = ['read_qiita'];

function* loginQiitaTask(action) {
  try {
    const { requiredUI } = action.payload;
    if (requiredUI) {
      if (_.isEmpty(Config.CLIENT_ID) || _.isEmpty(Config.CLIENT_SECRET)) {
        // eslint-disable-next-line no-console
        console.error('You must define CLIENT_ID and CLIENT_SECRET at .env file');
        return; // TODO throw
      }
      const { code } = yield call(oAuthSession.start, {
        url: AUTH_URL,
        clientId: Config.CLIENT_ID,
        scopes: SCOPES,
        schema: Config.SCHEMA,
      });
      const { token } = yield call(fetchAccessToken, code);
      yield call(setSession, { token });
      QiitaApi.token = token;
    } else {
      const { token } = yield call(getSession);
      QiitaApi.token = token;
    }
    const authenticatedUser = yield call(QiitaApi.fetchAuthenticatedUser);
    yield put(completeLoginQiita(authenticatedUser, LoginStatus.LOGGEDIN_AS_USER));
  } catch (e) {
    yield put(abortLoginQiita(e));
  }
}

export function* subscribeLoginQiita() {
  yield takeLatest((action) => {
    const expected = startLoginQiita();
    return action.type === expected.type && action.meta.status === expected.meta.status;
  }, loginQiitaTask);
}
