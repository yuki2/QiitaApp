import keyMirror from 'keymirror';
import _ from 'lodash';
import Config from 'react-native-config';
import { createAction } from 'redux-actions';
import { call, fork, put, takeLatest } from 'redux-saga/effects';
import { qiitaApi, qiitaAuth } from '../services/qiita-client';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';

export const LoginStatus = keyMirror({
  UNKNOWN: null,
  NOT_LOGGEDIN: null,
  LOGGEDIN_AS_USER: null,
  LOGGEDIN_AS_GUEST: null,
});

export const login = createAction(LOGIN, (requiredUI = true) => ({
  requiredUI,
}));

export const loggedIn = createAction(LOGGED_IN, (myUser, loginStatus) => ({
  myUser,
  loginStatus,
}));

export const logout = createAction(LOGOUT);

export const loggedOut = createAction(LOGGED_OUT, () => ({
  loginStatus: LoginStatus.NOT_LOGGEDIN,
}));

const initialState = {
  loading: false,
  loginStatus: LoginStatus.UNKNOWN,
  myUser: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGGED_IN:
      return {
        myUser: action.payload.myUser,
        loginStatus: action.payload.loginStatus,
        loading: false,
      };
    case LOGGED_OUT:
      return {
        myUser: {},
        loginStatus: action.payload.loginStatus,
        loading: false,
      };
    default:
      return state;
  }
}

function* loginTask(action) {
  const { requiredUI } = action.payload;
  try {
    if (requiredUI) {
      if (_.isEmpty(Config.CLIENT_ID) || _.isEmpty(Config.CLIENT_SECRET)) {
        // eslint-disable-next-line no-console
        console.error('You must define CLIENT_ID and CLIENT_SECRET at .env file');
        return; // TODO throw
      }
      const { code } = yield call(qiitaAuth.authorize);
      const { token } = yield call(qiitaAuth.fetchAccessToken, code);
      qiitaApi.token = token;
    } else {
      const { token } = yield call(qiitaAuth.getSession);
      qiitaApi.token = token;
    }
    const authenticatedUser = yield call(qiitaApi.fetchAuthenticatedUser);
    yield put(loggedIn(authenticatedUser, LoginStatus.LOGGEDIN_AS_USER));
  } catch (e) {
    yield put(logout());
  }
}

function* logoutTask() {
  try {
    yield call(qiitaAuth.clearSession);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
  } finally {
    yield put(loggedOut());
  }
}

export function* subscribeSession() {
  yield fork(takeLatest, LOGIN, loginTask);
  yield fork(takeLatest, LOGOUT, logoutTask);
}
