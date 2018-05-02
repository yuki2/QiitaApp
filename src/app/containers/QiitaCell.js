// @flow
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight } from 'react-native';

import type { QiitaItem } from '../flow-type';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    textAlign: 'left',
    marginTop: 4,
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    marginLeft: 4,
    textAlign: 'left',
    color: 'gray',
  },
  tag: {
    fontSize: 12,
    textAlign: 'left',
    color: 'gray',
    marginTop: 4,
    marginBottom: 4,
  },
  thumbnail: {
    width: 12,
    height: 12,
  },
});

type Props = {
  item: QiitaItem,
  onSelect: (item: QiitaItem) => void,
};
export default class QiitaCell extends Component<Props> {
  static defaultProps = {
    onSelect: () => {},
    item: {},
  };

  createTag = (item: QiitaItem): string => item.tags.map(tag => tag.name).join(', ');

  render() {
    const { onSelect, item } = this.props;
    return (
      <TouchableHighlight onPress={onSelect}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Image source={{ uri: item.user.profileImageUrl }} style={styles.thumbnail} />
            <Text style={styles.name}>{item.user.id}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.tag}>{item.tags.map(tag => tag.name).join(', ')}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
