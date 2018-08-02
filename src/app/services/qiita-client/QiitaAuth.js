import _ from 'lodash';
import { AsyncStorage, Linking, NativeModules, Platform } from 'react-native';
import { createUrl } from './utility';

const nativeOAuthSession = Platform.select({
  ios: NativeModules.OAuthSession,
});

const nativeFetchCode = (url, schema) =>
  nativeOAuthSession.start({
    url,
    schema,
  });

const fetchCodeWithBrowser = url =>
  new Promise((resolve) => {
    const handleUrl = (event) => {
      Linking.removeEventListener('url', handleUrl);
      const codeResult = event.url.toString().match(/code=(.*?)(&|$)/);
      if (_.isEmpty(codeResult)) {
        throw new Error('code is empty');
      }
      resolve({ code: codeResult[1] });
    };
    Linking.openURL(url);
    Linking.addEventListener('url', handleUrl);
  });

const fetchCode = (url, schema) => {
  if (Platform.OS === 'ios') {
    return nativeFetchCode(url, schema);
  } else if (Platform.OS === 'android') {
    return fetchCodeWithBrowser(url);
  }
  throw new Error('unknown OS');
};

export default class QiitaAuth {
  constructor(configuration) {
    this._configuration = configuration;
  }

  authorize = () => {
    const {
      baseUrl, clientId, scopes, schema,
    } = this._configuration;
    const path = '/api/v2/oauth/authorize';
    const url = createUrl(baseUrl + path, { client_id: clientId, scope: scopes });
    return fetchCode(url, schema);
  };

  fetchAccessToken = (code: string): Promise<JSON> => {
    const method = 'POST';
    const { baseUrl, clientId, clientSecret } = this._configuration;
    const body = JSON.stringify({ client_id: clientId, client_secret: clientSecret, code });
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const path = '/api/v2/access_tokens';
    return fetch(createUrl(baseUrl + path), { method, headers, body })
      .then((response) => {
        if (!response.ok) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({ status: response.status });
        }
        return response.json();
      })
      .then(sessionModel => this.setSession(sessionModel).then(() => sessionModel));
  };

  getSession = () => AsyncStorage.getItem('session').then(res => JSON.parse(res));

  setSession = sessionModel => AsyncStorage.setItem('session', JSON.stringify(sessionModel));

  clearSession = () => AsyncStorage.setItem('session', JSON.stringify({}));
}
