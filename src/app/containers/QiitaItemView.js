import React from 'react';
import { WebView } from 'react-native';

import type { QiitaItem } from '../flow-type';

type Props = {
  item: QiitaItem,
};

const QiitaItemView = (props: Props) => {
  const { item } = props;
  return <WebView source={{ html: item.rendered_body }} scalesPageToFit />;
};
export default QiitaItemView;
