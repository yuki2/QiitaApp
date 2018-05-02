// @flow
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import type { QiitaItemsModel, QiitaItem } from '../flow-type';
import { PRIMARY_COLOR } from '../design';
import { startSearchItems } from '../modules/search';
import { openInAppBrowser } from '../modules/inAppWebView';

import SearchBar from './SearchBar';
import QiitaList from './QiitaList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarSpace: {
    height: 20,
    backgroundColor: PRIMARY_COLOR,
  },
});

const PER_PAGE = 50;

const mapStateToProps = state => ({
  search: state.search,
});

const mapDispatchToProps = dispatch => ({
  searchItems: (query: string, page: number, perPage: number, refresh: boolean) => {
    dispatch(startSearchItems(query, page, perPage, refresh));
  },
  openInAppBrowserByUrl: (url: string) => {
    dispatch(openInAppBrowser(url));
  },
});

type Props = {
  searchItems: (query: string, page: number, perPage: number, refresh: boolean) => void,
  search: { loading: boolean, model: QiitaItemsModel },
  openInAppBrowserByUrl: (url: string) => void,
};
class SearchContainer extends Component<Props> {
  _onChangeText = (text: string) => {
    const { searchItems } = this.props;
    searchItems(text, 1, PER_PAGE, true);
  };

  _onSelectItem = (item: QiitaItem) => {
    this.props.openInAppBrowserByUrl(item.url);
  };

  render() {
    const { search } = this.props;
    const { loading, model } = search;
    return (
      <View style={styles.container}>
        <View style={styles.statusBarSpace} />
        <SearchBar onChangeText={this._onChangeText} />
        <QiitaList items={model.items} loading={loading} onSelectItem={this._onSelectItem} />
      </View>
    );
  }
}

export default connect(() => mapStateToProps, mapDispatchToProps)(SearchContainer);
