import _ from 'underscore';

const BASE_URL = 'https://qiita.com';

const createUrl = (path, params = {}) => {
  if (_.isEmpty(params)) {
    return BASE_URL + path;
  }
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
  return `${BASE_URL + path}?${query}`;
};

const onFulfill = (response) => {
  if (!response.ok) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ status: response.status });
  }
  return response.json();
};

class QiitaApi {
  constructor() {
    this._token = '';
  }

  set token(val) {
    this._token = val;
  }

  authedFetch = (url) => {
    if (_.isEmpty(this._token)) {
      return fetch(url);
    }
    return fetch(url, {
      headers: { Authorization: `Bearer ${this._token}` },
    });
  };

  fetchAccessToken = ({ clientId, clientSecret, code }) => {
    const method = 'POST';
    const body = JSON.stringify({ client_id: clientId, client_secret: clientSecret, code });
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const path = '/api/v2/access_tokens';
    return fetch(createUrl(path), { method, headers, body }).then(onFulfill);
  };

  fetchItemsWithTag = (tag) => {
    const path = `/api/v2/tags/${tag}/items`;
    return this.authedFetch(createUrl(path)).then(onFulfill);
  };

  fetchItems = ({ page = 1, perPage = 20 }) => {
    const path = '/api/v2/items';
    return this.authedFetch(createUrl(path, { page, per_page: perPage })).then(onFulfill);
  };

  fetchItemsWithQuery = ({ query = '', page = 1, perPage = 20 }) => {
    const path = '/api/v2/items';
    return this.authedFetch(createUrl(path, { query, page, per_page: perPage })).then(onFulfill);
  };

  fetchAuthenticatedUser = () => {
    const path = '/api/v2/authenticated_user';
    return this.authedFetch(createUrl(path)).then(onFulfill);
  };
}

export default new QiitaApi();
