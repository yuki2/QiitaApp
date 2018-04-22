import _ from 'underscore';

const BASE_URL = 'https://qiita.com/api/v2';

export function fetchItemsWithTag(tag) {
  if (_.isEmpty(tag)) {
    return Promise.reject();
  }
  const path = `/tags/${tag}/items`;
  return fetch(BASE_URL + path).then(response => response.json());
}

export function fetchItemsWithQuery(query = '') {
  const path = '/items';
  if (_.isEmpty(query)) {
    return fetch(BASE_URL + path).then(response => response.json());
  }
  return fetch(BASE_URL + path, { query }).then(response => response.json());
}
