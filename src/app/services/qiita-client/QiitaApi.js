// @flow
import _ from 'lodash';

import type { PagingResponse } from '../../flow-type';

import { createUrl } from './utility';

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

export default class QiitaApi {
  _token: string;
  _baseUrl: string;
  constructor(baseUrl: string) {
    this._token = '';
    this._baseUrl = baseUrl;
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

  fetchItemsByTag = (
    tag: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<PagingResponse> => {
    const path = `/api/v2/tags/${tag}/items`;
    const url = createUrl(this._baseUrl + path, { page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };

  fetchItems = (page: number = 1, perPage: number = 20): Promise<PagingResponse> => {
    const path: string = '/api/v2/items';
    const url = createUrl(this._baseUrl + path, { page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };

  fetchItemsByQuery = (
    query: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<PagingResponse> => {
    const path: string = '/api/v2/items';
    const url = createUrl(this._baseUrl + path, { query, page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };

  fetchAuthenticatedUser = (): Promise<JSON> => {
    const path = '/api/v2/authenticated_user';
    return this.authedFetch(createUrl(this._baseUrl + path)).then(onFulfill);
  };

  fetchFollowingTags = (
    userId: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<PagingResponse> => {
    const path = `/api/v2/users/${userId}/following_tags`;
    const url = createUrl(this._baseUrl + path, { page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };

  fetchStockItems = (
    userId: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<PagingResponse> => {
    const path = `/api/v2/users/${userId}/stocks`;
    const url = createUrl(this._baseUrl + path, { page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };
}
