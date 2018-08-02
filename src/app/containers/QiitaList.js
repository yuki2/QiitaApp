// @flow
import React from 'react';
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

const QiitaList = (props: Props) => {
  const {
    loading = true,
    items = [],
    onRefresh = _.noop,
    onEndReached = _.noop,
    onSelectItem = _.noop,
  } = props;
  let refresh = {};
  if (onRefresh) {
    refresh = {
      refreshing: loading,
      onRefresh,
    };
  }
  return (
    <View style={styles.container}>
      <FlatList
        initialNumToRender={10}
        style={styles.listView}
        data={items}
        renderItem={({ item }) => <QiitaCell onSelect={onSelectItem} item={item} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={separator}
        onEndReachedThreshold={0.5}
        onEndReached={info => onEndReached(info.distanceFromEnd, _.size(items))}
        {...refresh}
      />
    </View>
  );
};

export default withIndicator(QiitaList);
