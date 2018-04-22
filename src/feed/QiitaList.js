import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Platform } from 'react-native';

import QiitaCell from './QiitaCell';
import QiitaIndicator from './QiitaIndicator';

const QIITA_URL = 'https://qiita.com/api/v2/tags/reactjs/items';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
    }),
  },
  listView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default class QiitaList extends Component {
  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loaded: false,
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  selectItem = () => {};

  fetchData = () => {
    fetch(QIITA_URL)
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          items: responseJson,
          loaded: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderLoadingView = () => <QiitaIndicator />;

  renderItem = ({ item }) => <QiitaCell onSelect={() => this.selectItem(item)} item={item} />;

  renderListView = () => (
    <View style={styles.container}>
      <FlatList
        style={styles.listView}
        data={this.state.items}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );

  render = () => {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderListView();
  };
}
