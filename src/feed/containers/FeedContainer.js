import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import QiitaList from './QiitaList';
import { startFetchLatestItems } from '../modules/latestItems';
import { openInAppBrowser } from '../../common/modules/inAppWebView';

const PER_PAGE = 50;

const mapStateToProps = state => ({
  latestItems: state.latestItems.itemModels,
  latestItemsLoading: state.latestItems.loading,
});

const mapDispatchToProps = dispatch => ({
  fetchLastestItems: (page, perPage, refresh) => {
    dispatch(startFetchLatestItems(page, perPage, refresh));
  },
  openInAppBrowserByUrl: (url) => {
    dispatch(openInAppBrowser(url));
  },
});

class FeedContainer extends Component {
  static defaultProps = {
    fetchLastestItems: () => {},
    openInAppBrowserByUrl: () => {},
    latestItems: [],
    latestItemsLoading: true,
  };
  static propTypes = {
    fetchLastestItems: PropTypes.func,
    openInAppBrowserByUrl: PropTypes.func,
    latestItems: PropTypes.array,
    latestItemsLoading: PropTypes.bool,
  };

  componentDidMount() {
    this.fetchLatestItems(1, true);
  }

  onRefresh = () => {
    this.fetchLatestItems(1, true);
  };

  onEndReached = (distanceFromEnd, size) => {
    const page = size / PER_PAGE + 1;
    this.fetchLatestItems(page, false);
  };

  onSelectItem = (item) => {
    this.props.openInAppBrowserByUrl(item.url);
  };

  fetchLatestItems = (page, refresh) => {
    this.props.fetchLastestItems(page, PER_PAGE, refresh);
  };

  render() {
    const { latestItems, latestItemsLoading } = this.props;
    return (
      <QiitaList
        items={latestItems}
        loading={latestItemsLoading}
        onSelectItem={this.onSelectItem}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
      />
    );
  }
}

export default connect(() => mapStateToProps, mapDispatchToProps)(FeedContainer);
