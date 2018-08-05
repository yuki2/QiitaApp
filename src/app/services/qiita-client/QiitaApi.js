// @flow
import _ from 'lodash';
import { createUrl } from './utility';

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

  fetchWithAuth = async (url: string): Promise<{ json: JSON, response: Response }> => {
    if (_.isEmpty(this._token)) {
      throw new Error('token is empty');
    }
    const response: Response = await fetch(url, {
      headers: { Authorization: `Bearer ${this._token}` },
    });
    if (!response.ok) {
      throw new Error(JSON.stringify({ status: response.status }));
    }
    const json: JSON = await response.json();
    return { response, json };
  };

  withTotalCount = ({ response, json }: { response: Response, json: JSON }) => {
    const totalCount: number = _.toNumber(response.headers.get('total-count'));
    const items = json;
    return { response, json: { totalCount, items } };
  };

  authedFetch = (url: string): Promise<Response> => {
    if (_.isEmpty(this._token)) {
      return fetch(url);
    }
    return fetch(url, {
      headers: { Authorization: `Bearer ${this._token}` },
    });
  };

  fetchItemsByTag = async (tag: string, page: number = 1, perPage: number = 20) => {
    const path = `/api/v2/tags/${tag}/items`;
    const url = createUrl(this._baseUrl + path, { page, per_page: perPage });
    const result = await this.fetchWithAuth(url);
    return this.withTotalCount(result).json;
  };

  fetchItems = async (page: number = 1, perPage: number = 20) => {
    const path: string = '/api/v2/items';
    const url = createUrl(this._baseUrl + path, { page, per_page: perPage });
    const result = await this.fetchWithAuth(url);
    return this.withTotalCount(result).json;
  };

  fetchItemsByQuery = async (query: string, page: number = 1, perPage: number = 20) => {
    const path: string = '/api/v2/items';
    const url = createUrl(this._baseUrl + path, { query, page, per_page: perPage });
    const result = await this.fetchWithAuth(url);
    return this.withTotalCount(result).json;
  };

  fetchAuthenticatedUser = async () => {
    const path = '/api/v2/authenticated_user';
    const url = createUrl(this._baseUrl + path);
    const result = await this.fetchWithAuth(url);
    return result.json;
  };

  fetchFollowingTags = async (userId: string, page: number = 1, perPage: number = 20) => {
    const path = `/api/v2/users/${userId}/following_tags`;
    const url = createUrl(this._baseUrl + path, { page, per_page: perPage });
    const result = await this.fetchWithAuth(url);
    return this.withTotalCount(result).json;
  };

  fetchStockItems = async (userId: string, page: number = 1, perPage: number = 20) => {
    const path = `/api/v2/users/${userId}/stocks`;
    const url = createUrl(this._baseUrl + path, { page, per_page: perPage });
    const result = await this.fetchWithAuth(url);
    return this.withTotalCount(result).json;
  };
}
