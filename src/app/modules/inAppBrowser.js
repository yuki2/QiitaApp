import { NativeModules } from 'react-native';
import { createAction } from 'redux-actions';
import { call, takeLatest } from 'redux-saga/effects';

const inAppBrowser = NativeModules.InAppBrowser;

const OPEN_IN_APP_BROWSER = 'OPEN_IN_APP_BROWSER';

const openInAppBrowser = createAction(OPEN_IN_APP_BROWSER, url => ({ url }));

function* openInAppBrowserTask(action) {
  try {
    const { url } = action.payload;
    yield call(inAppBrowser.show, url);
  } catch (e) {
    //
  }
}

function* subscribeOpenInAppBrowser() {
  yield takeLatest(OPEN_IN_APP_BROWSER, openInAppBrowserTask);
}

export { openInAppBrowser, subscribeOpenInAppBrowser };
