// @flow
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import _ from 'lodash';

import type { QiitaItemsModel, QiitaItem, QiitaUser } from '../flow-type';
import { PRIMARY_COLOR } from '../design';
import { startFetchStockItems } from '../modules/stockItems';
import { openInAppBrowser } from '../modules/inAppWebView';

import QiitaList from './QiitaList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const PER_PAGE = 50;

const mapStateToProps = state => ({
  stockItems: state.stockItems,
  myUser: state.session.myUser,
});

const mapDispatchToProps = dispatch => ({
  fetchStockItems: (userId: string, page: number, perPage: number, refresh: boolean) => {
    dispatch(startFetchStockItems(userId, page, perPage, refresh));
  },
  openInAppBrowserByUrl: (url: string) => {
    dispatch(openInAppBrowser(url));
  },
});

type Props = {
  fetchStockItems: (userId: string, page: number, perPage: number, refresh: boolean) => void,
  openInAppBrowserByUrl: (url: string) => void,
  stockItems: { loading: boolean, model: QiitaItemsModel },
  myUser: QiitaUser,
};
class StockContainer extends Component<Props> {
  static defaultProps = {
    fetchStockItems: () => {},
    openInAppBrowserByUrl: () => {},
    stockItems: { loading: false, model: { items: [] } },
    myUser: {},
  };

  componentDidMount = () => {
    const { stockItems, fetchStockItems, myUser } = this.props;
    if (!_.isEmpty(stockItems.model.items)) {
      return;
    }
    fetchStockItems(myUser.id, 1, PER_PAGE, true);
  };

  _onRefresh = () => {
    const { fetchStockItems, myUser } = this.props;
    fetchStockItems(myUser.id, 1, PER_PAGE, true);
  };

  _onEndReached = (distanceFromEnd: number, size: number) => {
    const page = size / PER_PAGE + 1;
    const { stockItems, fetchStockItems, myUser } = this.props;
    if (_.size(stockItems.model.items) < PER_PAGE) {
      return;
    }
    fetchStockItems(myUser.id, page, PER_PAGE, true);
  };

  _onSelectItem = (item: QiitaItem) => {
    this.props.openInAppBrowserByUrl(item.url);
  };

  render() {
    const { stockItems } = this.props;
    const { loading, model } = stockItems;
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

export default connect(() => mapStateToProps, mapDispatchToProps)(StockContainer);