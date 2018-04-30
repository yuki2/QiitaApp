import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import QiitaList from './QiitaList';
import { startFetchLatestItems } from '../modules/latestItems';
import { openInAppBrowser } from '../../common/modules/inAppWebView';

const PER_PAGE = 50;

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#59BB0C',
  },
});

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
  state = {
    index: 0,
    routes: [{ key: 'latest', title: 'Latest' }, { key: 'tagFeed', title: 'Tag Feed' }],
  };

  componentDidMount() {
    this.fetchItems(1, true);
  }

  _onRefresh = () => {
    this.fetchItems(1, true);
  };

  _onEndReached = (distanceFromEnd, size) => {
    const page = size / PER_PAGE + 1;
    this.fetchItems(page, false);
  };

  _onSelectItem = (item) => {
    this.props.openInAppBrowserByUrl(item.url);
  };

  fetchItems = (page, refresh) => {
    const { fetchLastestItems } = this.props;
    console.log(JSON.stringify(this.props));
    fetchLastestItems(page, PER_PAGE, refresh);
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar style={tabStyles.tabBar} {...props} />;

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'latest': {
        const { latestItems, latestItemsLoading } = this.props;
        return (
          <QiitaList
            items={latestItems}
            loading={latestItemsLoading}
            onSelectItem={this._onSelectItem}
            onRefresh={this._onRefresh}
            onEndReached={this._onEndReached}
          />
        );
      }
      case 'tagFeed':
        return <View style={[{ flex: 1 }, { backgroundColor: '#673ab7' }]} />;
      default:
        return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

export default connect(() => mapStateToProps, mapDispatchToProps)(FeedContainer);
