// @flow
import _ from 'lodash';

import type { PagingResponse } from '../../flow-type';

const BASE_URL = 'https://qiita.com';

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

  fetchAccessToken = (clientId: string, clientSecret: string, code: string): Promise<JSON> => {
    const method = 'POST';
    const body = JSON.stringify({ client_id: clientId, client_secret: clientSecret, code });
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
}

export default new QiitaApi();
