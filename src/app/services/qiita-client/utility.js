// @flow
import _ from 'lodash';

const createUrl = (url: string, params: any = {}): string => {
  if (_.isEmpty(params)) {
    return url;
  }
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
  return `${url}?${query}`;
};
// eslint-disable-next-line import/prefer-default-export
export { createUrl };
