// @flow
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import type { QiitaItem } from '../flow-type';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 8,
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
  subText: {
    fontSize: 12,
    marginLeft: 4,
    textAlign: 'left',
    color: 'gray',
  },
  tagsIcon: {
    marginLeft: 8,
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

  _renderLikesCount = (item: QiitaItem) => {
    if (item.likesCount === 0) {
      return null;
    }

    return (
      <View style={styles.row}>
        <Icon name="md-thumbs-up" size={12} color="gray" />
        <Text style={[styles.subText, { marginRight: 8 }]}>{item.likesCount}</Text>
      </View>
    );
  };

  render() {
    const { onSelect, item } = this.props;
    return (
      <TouchableHighlight onPress={onSelect}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Image source={{ uri: item.user.profileImageUrl }} style={styles.thumbnail} />
            <Text style={styles.subText}>{item.user.id}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.row}>
            {this._renderLikesCount(item)}
            <Icon name="ios-pricetags" size={12} color="gray" />
            <Text style={styles.subText}>{item.tags.map(tag => tag.name).join(', ')}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
