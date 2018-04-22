import React, { Component } from 'react';
import { WebView } from 'react-native';
import PropTypes from 'prop-types';

import QiitaIndicator from './QiitaIndicator';

export default class QiitaItemView extends Component {
  static defaultProps = {
    item: {},
  };

  renderLoadingView = () => <QiitaIndicator />;

  render() {
    return <WebView source={{ html: this.props.item.rendered_body }} scalesPageToFit />;
  }
}

QiitaItemView.propTypes = {
  item: PropTypes.object,
};
