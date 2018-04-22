import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

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
});

export default class QiitaList extends Component {
  static defaultProps = {
    items: [],
    loaded: false,
    onSelectItem: () => {},
  };

  selectItem = () => {};

  renderLoadingView = () => <QiitaIndicator />;

  renderItem = ({ item }) => (
    <QiitaCell onSelect={() => this.props.onSelectItem(item)} item={item} />
  );

  renderListView = () => (
    <View style={styles.container}>
      <FlatList
        style={styles.listView}
        data={this.props.items}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );

  render = () => {
    if (!this.props.loaded) {
      return this.renderLoadingView();
    }
    return this.renderListView();
  };
}

QiitaList.propTypes = {
  items: PropTypes.array,
  loaded: PropTypes.bool,
  onSelectItem: PropTypes.func,
};
