import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';

import QiitaCell from './QiitaCell';
import QiitaIndicator from './QiitaIndicator';

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

export default class QiitaList extends Component {
  static defaultProps = {
    items: [],
    loading: true,
    onSelectItem: () => {},
    onRefresh: () => {},
    onEndReached: () => {},
  };

  selectItem = () => {};

  renderLoadingView = () => <QiitaIndicator />;

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
          shouldItemUpdate={(props, nextProps) => props.item !== nextProps.item}
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

  render = () => {
    const { loading, items } = this.props;
    if (loading && _.isEmpty(items)) {
      return this.renderLoadingView();
    }
    return this.renderListView(items);
  };
}

QiitaList.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  onSelectItem: PropTypes.func,
  onRefresh: PropTypes.func,
  onEndReached: PropTypes.func,
};
