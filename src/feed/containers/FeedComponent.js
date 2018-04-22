import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import QiitaList from './QiitaList';
import { fetchLatestItemsStart } from '../modules/latestItems';

const mapStateToProps = state => ({
  latestItems: state.latestItems.itemModels,
  latestItemsLoaded: state.latestItems.loaded,
});

const mapDispatchToProps = dispatch => ({
  fetchAllItems: () => {
    dispatch(fetchLatestItemsStart());
  },
});

class FeedComponent extends Component {
  static defaultProps = {
    fetchAllItems: () => {},
    latestItems: [],
    latestItemsLoaded: false,
    navigator: {},
  };
  componentDidMount() {
    this.props.fetchAllItems();
  }

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

  render() {
    const { latestItems, latestItemsLoaded } = this.props;
    return (
      <QiitaList items={latestItems} loaded={latestItemsLoaded} onSelectItem={this.onSelectItem} />
    );
  }
}
FeedComponent.propTypes = {
  fetchAllItems: PropTypes.func,
  latestItems: PropTypes.array,
  latestItemsLoaded: PropTypes.bool,
  navigator: PropTypes.object,
};

export default connect(() => mapStateToProps, mapDispatchToProps)(FeedComponent);
