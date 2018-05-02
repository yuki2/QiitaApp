// @flow
import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import type { QiitaItemsModel, QiitaUser, QiitaItem } from '../flow-type';

import { openInAppBrowser } from '../modules/inAppWebView';

import QiitaList from './QiitaList';
import { startFetchLatestFeed } from '../modules/latestFeed';
import { startFetchTagFeed } from '../modules/tagFeed';

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

type Props = {
  fetchLastestFeed: (page: number, perPage: number, refresh: boolean) => void,
  fetchTagFeed: (userId: string, page: number, perPage: number, refresh: boolean) => void,
  openInAppBrowserByUrl: (url: string) => void,
  latestFeed: { loading: boolean, model: QiitaItemsModel },
  tagFeed: { loading: boolean, model: QiitaItemsModel },
  myUser: QiitaUser,
};
type State = {
  index: number,
  routes: Array<any>,
};
type Adapter = Array<{
  fetchItems: (page: number, refresh: boolean, props: Props) => void,
  render: (props: Props) => any,
}>;
class FeedContainer extends Component<Props, State> {
  static defaultProps = {
    fetchLastestFeed: () => {},
    fetchTagFeed: () => {},
    openInAppBrowserByUrl: () => {},
    latestFeed: { loading: true, model: { items: [] } },
    tagFeed: { loading: true, model: { items: [] } },
    myUser: {},
  };

  constructor(props: Props) {
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
    this.adapter = this._createAdapter();
  }
  componentDidMount = () => {
    this.adapter.forEach(f => f.fetchItems(1, true, this.props));
  };
  adapter: Adapter;

  _createAdapter = (): Adapter => [
    {
      fetchItems: (page: number, refresh: boolean, props: Props) => {
        const { fetchLastestFeed } = props;
        fetchLastestFeed(page, PER_PAGE, refresh);
      },
      render: (props: Props) => {
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
      fetchItems: (page: number, refresh: boolean, props: Props) => {
        const { fetchTagFeed, myUser } = props;
        fetchTagFeed(myUser.id, page, 20, refresh);
      },
      render: (props: Props) => {
        const { tagFeed } = props;
        const { model, loading } = tagFeed;
        return (
          <QiitaList
            items={model.items}
            loading={loading}
            onRefresh={this._onRefresh}
            onSelectItem={this._onSelectItem}
          />
        );
      },
    },
  ];

  _onRefresh = () => {
    this._fetchItems(1, true);
  };

  _onEndReached = (distanceFromEnd: number, size: number) => {
    const page = size / PER_PAGE + 1;
    this._fetchItems(page, false);
  };

  _fetchItems = (page: number, refresh: boolean) => {
    const { index } = this.state;
    this.functionMap[index].fetchItems(page, refresh, this.props);
  };

  _onSelectItem = (item: QiitaItem) => {
    this.props.openInAppBrowserByUrl(item.url);
  };

  _handleIndexChange = (index: number) => this.setState({ index });

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
