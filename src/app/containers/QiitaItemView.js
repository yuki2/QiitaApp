import React, { PureComponent } from 'react';
import { WebView } from 'react-native';
import PropTypes from 'prop-types';

export default class QiitaItemView extends PureComponent {
  static defaultProps = {
    item: {},
  };
  static propTypes = {
    item: PropTypes.object,
  };

  render() {
    return <WebView source={{ html: this.props.item.rendered_body }} scalesPageToFit />;
  }
}
