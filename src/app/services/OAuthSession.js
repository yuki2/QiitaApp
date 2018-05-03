import { Platform, NativeModules, Linking } from 'react-native';
import _ from 'lodash';

const createUrl = (url, params) => {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
  return `${url}?${query}`;
};

const nativeOAuthSession = Platform.select({
  ios: NativeModules.OAuthSession,
});

const nativeFetchCode = (url, clientId, scopes, schema) =>
  nativeOAuthSession.start({
    url,
    clientId,
    scopes,
    schema,
  });

const fetchCodeByBrowser = (url, clientId, scopes) =>
  new Promise((resolve) => {
    const handleUrl = (event) => {
      Linking.removeEventListener('url', handleUrl);
      const codeResult = event.url.toString().match(/code=(.*?)(&|$)/);
      if (_.isEmpty(codeResult)) {
        throw new Error('code is empty');
      }
      resolve({ code: codeResult[1] });
    };
    const scopesQuery = scopes.join(' ');
    Linking.openURL(createUrl(url, { client_id: clientId, scope: scopesQuery }));
    Linking.addEventListener('url', handleUrl);
  });

export { nativeFetchCode, fetchCodeByBrowser };
