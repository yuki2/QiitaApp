import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import QiitaList from './QiitaList';
import { startFetchLatestItems } from '../modules/latestItems';
import { openInAppBrowser } from '../modules/inAppWebView';

const PER_PAGE = 50;

const mapStateToProps = state => ({
  latestItems: state.latestItems.itemModels,
  latestItemsLoading: state.latestItems.loading,
});

const mapDispatchToProps = dispatch => ({
  fetchLastestItems: (page, perPage) => {
    dispatch(startFetchLatestItems(page, perPage));
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

  componentDidMount() {
    this.fetchLatestItems(1);
  }

  onRefresh = () => {
    this.fetchLatestItems(1);
  };

  onEndReached = (distanceFromEnd, size) => {
    const page = size / PER_PAGE + 1;
    this.fetchLatestItems(page);
  };

  onSelectItem = (item) => {
    this.props.openInAppBrowserByUrl(item.url);
  };

  fetchLatestItems = (page) => {
    this.props.fetchLastestItems(page, PER_PAGE);
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
FeedContainer.propTypes = {
  fetchLastestItems: PropTypes.func,
  openInAppBrowserByUrl: PropTypes.func,
  latestItems: PropTypes.array,
  latestItemsLoading: PropTypes.bool,
};

export default connect(() => mapStateToProps, mapDispatchToProps)(FeedContainer);
