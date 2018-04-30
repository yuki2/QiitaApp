import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import QiitaIndicator from './QiitaIndicator';

export default function withIndicator(WrappedComponent) {
  return class WithIndicator extends PureComponent {
    static defaultProps = {
      loading: true,
      items: [],
    };
    static propTypes = {
      loading: PropTypes.bool,
      items: PropTypes.array,
    };
    render() {
      const { loading, items } = this.props;
      if (loading && _.isEmpty(items)) {
        return <QiitaIndicator />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}
