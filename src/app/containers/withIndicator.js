// @flow
import React from 'react';
import _ from 'lodash';

import type { QiitaItem } from '../flow-type';

import QiitaIndicator from './QiitaIndicator';

type Props = {
  items: Array<QiitaItem>,
  loading: boolean,
};
const withIndicator = (WrappedComponent: any) => (props: Props) => {
  const { loading = true, items = [] } = props;
  if (loading && _.isEmpty(items)) {
    return <QiitaIndicator />;
  }
  return <WrappedComponent {...props} />;
};

export default withIndicator;
