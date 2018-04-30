import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';

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

class QiitaList extends Component {
  static defaultProps = {
    items: [],
    loading: true,
    onSelectItem: () => {},
    onRefresh: () => {},
    onEndReached: () => {},
  };
  static propTypes = {
    items: PropTypes.array,
    loading: PropTypes.bool,
    onSelectItem: PropTypes.func,
    onRefresh: PropTypes.func,
    onEndReached: PropTypes.func,
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
    const { items } = this.props;
    return this.renderListView(items);
  };
}

export default withIndicator(QiitaList);
