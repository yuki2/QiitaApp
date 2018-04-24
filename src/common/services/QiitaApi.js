import _ from 'underscore';

const BASE_URL = 'https://qiita.com/api/v2';

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
  if (response.status < 200 || response.status >= 300) {
    throw new Error(JSON.stringify({ status: response.status }));
  }
  return response.json();
};

export function fetchItemsWithTag(tag) {
  const path = `/tags/${tag}/items`;
  return fetch(createUrl(path)).then(onFulfill);
}

export function fetchItems({ page = 1, perPage = 20 }) {
  const path = '/items';
  return fetch(createUrl(path, { page, per_page: perPage })).then(onFulfill);
}

export function fetchItemsWithQuery({ query = '', page = 1, perPage = 20 }) {
  const path = '/items';
  return fetch(createUrl(path, { query, page, per_page: perPage })).then(onFulfill);
}
