// @flow
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { PRIMARY_COLOR } from '../design';
import { openInAppBrowser } from '../modules/inAppBrowser';
import { startFetchLatestFeed } from '../modules/latestFeed';
import QiitaList from './QiitaList';

import type { QiitaItemsModel, QiitaItem } from '../flow-type';

const PER_PAGE = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabBar: {
    backgroundColor: PRIMARY_COLOR,
  },
});

const mapStateToProps = state => ({
  latestFeed: state.latestFeed,
});

const mapDispatchToProps = dispatch => ({
  fetchLastestFeed: (page, perPage, refresh) => {
    dispatch(startFetchLatestFeed(page, perPage, refresh));
  },
  openInAppBrowserByUrl: (url) => {
    dispatch(openInAppBrowser(url));
  },
});

type Props = {
  fetchLastestFeed: (page: number, perPage: number, refresh: boolean) => void,
  openInAppBrowserByUrl: (url: string) => void,
  latestFeed: { loading: boolean, model: QiitaItemsModel },
};
class LatestFeedContainer extends Component<Props> {
  static defaultProps = {
    fetchLastestFeed: () => {},
    openInAppBrowserByUrl: () => {},
    latestFeed: { loading: false, model: { items: [] } },
  };

  componentDidMount() {
    this._fetchItems(1, true);
  }

  _fetchItems = (page: number, refresh: boolean) => {
    const { fetchLastestFeed } = this.props;
    fetchLastestFeed(page, PER_PAGE, refresh);
  };

  _onRefresh = () => {
    this._fetchItems(1, true);
  };

  _onEndReached = (distanceFromEnd: number, size: number) => {
    const page = size / PER_PAGE + 1;
    this._fetchItems(page, false);
  };

  _onSelectItem = (item: QiitaItem) => {
    const { openInAppBrowserByUrl } = this.props;
    openInAppBrowserByUrl(item.url);
  };

  render() {
    const { latestFeed } = this.props;
    const { model, loading } = latestFeed;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          <QiitaList
            items={model.items}
            loading={loading}
            onSelectItem={this._onSelectItem}
            onRefresh={this._onRefresh}
            onEndReached={this._onEndReached}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(() => mapStateToProps, mapDispatchToProps)(LatestFeedContainer);
