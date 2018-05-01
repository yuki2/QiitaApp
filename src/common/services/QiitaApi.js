import _ from 'lodash';

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

const onFulfillPaging = (response) => {
  if (!response.ok) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ status: response.status });
  }
  const totalCount = _.toNumber(response.headers.get('total-count'));
  return response.json().then(items => ({ totalCount, items }));
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

  fetchItemsByTag = ({ tag, page = 1, perPage = 20 }) => {
    const path = `/api/v2/tags/${tag}/items`;
    return this.authedFetch(createUrl(path, { page, per_page: perPage })).then(onFulfillPaging);
  };

  fetchItems = ({ page = 1, perPage = 20 }) => {
    const path = '/api/v2/items';
    return this.authedFetch(createUrl(path, { page, per_page: perPage })).then(onFulfillPaging);
  };

  fetchAuthenticatedUser = () => {
    const path = '/api/v2/authenticated_user';
    return this.authedFetch(createUrl(path)).then(onFulfill);
  };

  fetchFollowingTags = ({ userId, page = 1, perPage = 20 }) => {
    const path = `/api/v2/users/${userId}/following_tags`;
    const url = createUrl(path, { page, per_page: perPage });
    return this.authedFetch(url).then(onFulfillPaging);
  };
}

export default new QiitaApi();
