// @flow
import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import _ from 'lodash';

import type { QiitaItem } from '../flow-type';

import QiitaCell from './QiitaCell';
import withIndicator from './withIndicator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: 'lightgray',
    marginLeft: 8,
  },
});

const separator = () => <View style={styles.separator} />;

type Props = {
  items: Array<QiitaItem>,
  loading: boolean,
  onSelectItem: (item: QiitaItem) => void,
  onRefresh: () => void,
  onEndReached: (distanceFromEnd: number, size: number) => void,
};

class QiitaList extends Component<Props> {
  static defaultProps = {
    items: [],
    loading: true,
    onSelectItem: () => {},
    onRefresh: () => {},
    onEndReached: () => {},
  };

  renderItem = ({ item }) => (
    <QiitaCell onSelect={() => this.props.onSelectItem(item)} item={item} />
  );

  renderListView = () => {
    const {
      loading, items, onRefresh, onEndReached,
    } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          initialNumToRender={10}
          style={styles.listView}
          data={items}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={separator}
          refreshing={loading}
          onRefresh={onRefresh}
          onEndReachedThreshold={0.5}
          onEndReached={info => onEndReached(info.distanceFromEnd, _.size(items))}
        />
      </View>
    );
  };

  render = () => this.renderListView();
}

export default withIndicator(QiitaList);
