// @flow
import _ from 'lodash';
import { Platform } from 'react-native';
import Config from 'react-native-config';

import type { PagingResponse } from '../flow-type';

import { nativeFetchCode, fetchCodeByBrowser } from './OAuthSession';

const BASE_URL = 'https://qiita.com';
const SCOPES = ['read_qiita'];
const { CLIENT_ID, CLIENT_SECRET, SCHEMA } = Config;

const createUrl = (path: string, params: any = {}) => {
  if (_.isEmpty(params)) {
    return BASE_URL + path;
  }
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
  return `${BASE_URL + path}?${query}`;
};

const onFulfill = (response: Response): Promise<JSON> => {
  if (!response.ok) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ status: response.status });
  }

  return response.json();
};

const onFulfillPaging = (response: Response): Promise<PagingResponse> => {
  if (!response.ok) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ status: response.status });
  }
  const totalCount: number = _.toNumber(response.headers.get('total-count'));
  return response.json().then(items => ({ totalCount, items }));
};

class QiitaApi {
  _token: string;
  constructor() {
    this._token = '';
  }

  set token(val: string) {
    this._token = val;
  }

  authedFetch = (url: string): Promise<Response> => {
    if (_.isEmpty(this._token)) {
      return fetch(url);
    }
    return fetch(url, {
      headers: { Authorization: `Bearer ${this._token}` },
    });
  };

  fetchCode = () => {
    const path = '/api/v2/oauth/authorize';
    if (Platform.OS === 'ios') {
      return nativeFetchCode(BASE_URL + path, CLIENT_ID, SCOPES, SCHEMA);
    } else if (Platform.OS === 'android') {
      return fetchCodeByBrowser(BASE_URL + path, CLIENT_ID, SCOPES);
    }
    throw new Error('unknown OS');
  };

  fetchAccessToken = (code: string): Promise<JSON> => {
    const method = 'POST';
    const body = JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code });
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const path = '/api/v2/access_tokens';
    return fetch(createUrl(path), { method, headers, body }).then(onFulfill);
  };

  fetchItemsByTag = (
    tag: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<PagingResponse> => {
    const path = `/api/v2/tags/${tag}/items`;
    return this.authedFetch(createUrl(path, { page, per_page: perPage })).then(onFulfillPaging);
  };

  fetchItems = (page: number = 1, perPage: number = 20): Promise<PagingResponse> => {
    const path: string = '/api/v2/items';
    return this.authedFetch(createUrl(path, { page, per_page: perPage })).then(onFulfillPaging);
  };

  fetchItemsByQuery = (
    query: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<PagingResponse> => {
    const path: string = '/api/v2/items';
    const url = createUrl(path, { query, page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };

  fetchAuthenticatedUser = (): Promise<JSON> => {
    const path = '/api/v2/authenticated_user';
    return this.authedFetch(createUrl(path)).then(onFulfill);
  };

  fetchFollowingTags = (
    userId: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<PagingResponse> => {
    const path = `/api/v2/users/${userId}/following_tags`;
    const url = createUrl(path, { page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };

  fetchStockItems = (
    userId: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<PagingResponse> => {
    const path = `/api/v2/users/${userId}/stocks`;
    const url = createUrl(path, { page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };
}

export default new QiitaApi();
