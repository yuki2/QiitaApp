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
  };
  componentDidMount() {
    this.props.fetchAllItems();
  }
  render() {
    const { latestItems, latestItemsLoaded } = this.props;
    return <QiitaList items={latestItems} loaded={latestItemsLoaded} />;
  }
}
FeedComponent.propTypes = {
  fetchAllItems: PropTypes.func,
  latestItems: PropTypes.array,
  latestItemsLoaded: PropTypes.bool,
};

export default connect(() => mapStateToProps, mapDispatchToProps)(FeedComponent);
