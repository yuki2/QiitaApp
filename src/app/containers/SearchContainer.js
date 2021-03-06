// @flow
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import type { QiitaItemsModel, QiitaItem } from '../flow-type';
import { PRIMARY_COLOR } from '../design';
import { searchItems } from '../modules/search';
import { openInAppBrowser } from '../modules/inAppBrowser';

import SearchBar from './SearchBar';
import QiitaList from './QiitaList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
});

const PER_PAGE = 50;

const mapStateToProps = state => ({
  search: state.search,
});

const mapDispatchToProps = dispatch => ({
  searchItemsWithQuery: (query: string, page: number, perPage: number, refresh: boolean) => {
    dispatch(searchItems(query, page, perPage, refresh));
  },
  openInAppBrowserByUrl: (url: string) => {
    dispatch(openInAppBrowser(url));
  },
});

type Props = {
  searchItemsWithQuery: (query: string, page: number, perPage: number, refresh: boolean) => void,
  search: { loading: boolean, model: QiitaItemsModel },
  openInAppBrowserByUrl: (url: string) => void,
};
class SearchContainer extends Component<Props> {
  _onChangeText = (text: string) => {
    const { searchItemsWithQuery } = this.props;
    searchItemsWithQuery(text, 1, PER_PAGE, true);
  };

  _onSelectItem = (item: QiitaItem) => {
    this.props.openInAppBrowserByUrl(item.url);
  };

  render() {
    const { search } = this.props;
    const { loading, model } = search;
    return (
      <SafeAreaView style={styles.container}>
        <SearchBar onChangeText={this._onChangeText} />
        <QiitaList items={model.items} loading={loading} onSelectItem={this._onSelectItem} />
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
