import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import QiitaList from './QiitaList';
import { startFetchLatestItems } from '../modules/latestItems';

const mapStateToProps = state => ({
  latestItems: state.latestItems.itemModels,
  latestItemsLoaded: state.latestItems.loaded,
});

const mapDispatchToProps = dispatch => ({
  fetchLastestItems: () => {
    dispatch(startFetchLatestItems());
  },
});

class FeedComponent extends Component {
  static defaultProps = {
    fetchLastestItems: () => {},
    latestItems: [],
    latestItemsLoaded: false,
    navigator: {},
  };
  componentDidMount() {
    this.props.fetchLastestItems();
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
  fetchLastestItems: PropTypes.func,
  latestItems: PropTypes.array,
  latestItemsLoaded: PropTypes.bool,
  navigator: PropTypes.object,
};

export default connect(() => mapStateToProps, mapDispatchToProps)(FeedComponent);
