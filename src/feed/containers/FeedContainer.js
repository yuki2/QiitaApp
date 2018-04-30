import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';

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
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {
          key: 'latest',
          title: 'Latest',
        },
        { key: 'tagFeed', title: 'Tag Feed' },
      ],
    };
    this.functionMap = this._createFunctionMap();
  }

  componentDidMount = () => {
    this._fetchItems(1, true);
  };

  _createFunctionMap = () => [
    {
      fetchItems: (page, refresh, props) => {
        const { fetchLastestItems } = props;
        fetchLastestItems(page, PER_PAGE, refresh);
      },
      render: (props) => {
        const { latestItems, latestItemsLoading } = props;
        return (
          <QiitaList
            items={latestItems}
            loading={latestItemsLoading}
            onSelectItem={this._onSelectItem}
            onRefresh={this._onRefresh}
            onEndReached={this._onEndReached}
          />
        );
      },
    },
    {
      fetchItems: () => {},
      render: () => <View style={[{ flex: 1 }, { backgroundColor: '#673ab7' }]} />,
    },
  ];

  _onRefresh = () => {
    this._fetchItems(1, true);
  };

  _onEndReached = (distanceFromEnd, size) => {
    const page = size / PER_PAGE + 1;
    this._fetchItems(page, false);
  };

  _fetchItems = (page, refresh) => {
    const { index } = this.state;
    this.functionMap[index].fetchItems(page, refresh, this.props);
  };

  _onSelectItem = (item) => {
    this.props.openInAppBrowserByUrl(item.url);
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar style={tabStyles.tabBar} {...props} />;

  _renderScene = ({ index }) => this.functionMap[index].render(this.props);

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
