import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';

import QiitaList from './QiitaList';
import { startFetchLatestFeed } from '../modules/latestFeed';
import { startFetchTagFeed } from '../modules/tagFeed';
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
  latestFeed: state.latestFeed,
  tagFeed: state.tagFeed,
  myUser: state.session.myUser,
});

const mapDispatchToProps = dispatch => ({
  fetchLastestFeed: (page, perPage, refresh) => {
    dispatch(startFetchLatestFeed(page, perPage, refresh));
  },
  fetchTagFeed: (userId, page, perPage, refresh) => {
    dispatch(startFetchTagFeed(userId, page, perPage, refresh));
  },
  openInAppBrowserByUrl: (url) => {
    dispatch(openInAppBrowser(url));
  },
});

class FeedContainer extends Component {
  static defaultProps = {
    fetchLastestFeed: () => {},
    openInAppBrowserByUrl: () => {},
    latestFeed: { loading: true, model: { items: [] } },
    tagFeed: { loading: true, model: { items: [] } },
    myUser: {},
  };
  static propTypes = {
    fetchLastestFeed: PropTypes.func,
    openInAppBrowserByUrl: PropTypes.func,
    latestFeed: PropTypes.object,
    tagFeed: PropTypes.object,
    myUser: PropTypes.object,
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
    this.functionMap.forEach(f => f.fetchItems(1, true, this.props));
  };

  _createFunctionMap = () => [
    {
      fetchItems: (page, refresh, props) => {
        const { fetchLastestFeed } = props;
        fetchLastestFeed(page, PER_PAGE, refresh);
      },
      render: (props) => {
        const { latestFeed } = props;
        const { model, loading } = latestFeed;
        return (
          <QiitaList
            items={model.items}
            loading={loading}
            onSelectItem={this._onSelectItem}
            onRefresh={this._onRefresh}
            onEndReached={this._onEndReached}
          />
        );
      },
    },
    {
      fetchItems: (page, refresh, props) => {
        const { fetchTagFeed, myUser } = props;
        fetchTagFeed(myUser.id, page, PER_PAGE, refresh);
      },
      render: (props) => {
        const { tagFeed } = props;
        const { model, loading } = tagFeed;
        return (
          <QiitaList
            items={model.items}
            loading={loading}
            onSelectItem={this._onSelectItem}
            onRefresh={this._onRefresh}
            onEndReached={this._onEndReached}
          />
        );
      },
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
