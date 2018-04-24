import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import QiitaList from './QiitaList';
import { startFetchLatestItems } from '../modules/latestItems';

const PER_PAGE = 20;

const mapStateToProps = state => ({
  latestItems: state.latestItems.itemModels,
  latestItemsLoading: state.latestItems.loading,
});

const mapDispatchToProps = dispatch => ({
  fetchLastestItems: (page, perPage) => {
    dispatch(startFetchLatestItems(page, perPage));
  },
});

class FeedComponent extends Component {
  static defaultProps = {
    fetchLastestItems: () => {},
    latestItems: [],
    latestItemsLoading: true,
    navigator: {},
  };

  componentDidMount() {
    this.fetchLatestItems(1);
  }

  onRefresh = () => {
    this.fetchLatestItems(1);
  };

  onEndReached = (size) => {
    console.log(size);
    // const page = size / PER_PAGE + 1;
    // this.fetchLatestItems(page);
  };

  onSelectItem = (item) => {
    this.props.navigator.push({
      screen: 'qiitaapp.Item',
      title: item.title,
      passProps: { item },
      navigatorStyle: {
        navBarTranslucent: true,
        tabBarHidden: true,
      },
    });
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
FeedComponent.propTypes = {
  fetchLastestItems: PropTypes.func,
  latestItems: PropTypes.array,
  latestItemsLoading: PropTypes.bool,
  navigator: PropTypes.object,
};

export default connect(() => mapStateToProps, mapDispatchToProps)(FeedComponent);
