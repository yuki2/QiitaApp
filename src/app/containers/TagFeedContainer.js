// @flow
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { PRIMARY_COLOR } from '../design';
import { openInAppBrowser } from '../modules/inAppBrowser';
import { fetchTagFeed } from '../modules/tagFeed';
import QiitaList from './QiitaList';

import type { QiitaItemsModel, QiitaItem, QiitaUser } from '../flow-type';

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
  tagFeed: state.tagFeed,
  myUser: state.session.myUser,
});

const mapDispatchToProps = dispatch => ({
  fetchTagFeedWithUserId: (userId, page, perPage, refresh) => {
    dispatch(fetchTagFeed(userId, page, perPage, refresh));
  },
  openInAppBrowserByUrl: (url) => {
    dispatch(openInAppBrowser(url));
  },
});

type Props = {
  fetchTagFeedWithUserId: (userId: string, page: number, perPage: number, refresh: boolean) => void,
  openInAppBrowserByUrl: (url: string) => void,
  tagFeed: { loading: boolean, model: QiitaItemsModel },
  myUser: QiitaUser,
};
class TagFeedContainer extends Component<Props> {
  static defaultProps = {
    fetchTagFeedWithUserId: () => {},
    openInAppBrowserByUrl: () => {},
    tagFeed: { loading: false, model: { items: [] } },
  };

  componentDidMount() {
    this._fetchItems(1, true);
  }

  _fetchItems = (page: number, refresh: boolean) => {
    const { fetchTagFeedWithUserId, myUser } = this.props;
    fetchTagFeedWithUserId(myUser.id, page, PER_PAGE, refresh);
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
    const { tagFeed } = this.props;
    const { model, loading } = tagFeed;
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

export default connect(() => mapStateToProps, mapDispatchToProps)(TagFeedContainer);
