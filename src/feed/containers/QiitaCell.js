import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, Text, Image, TouchableHighlight } from 'react-native';

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

export default class QiitaCell extends Component {
  static defaultProps = {
    onSelect: () => {},
    item: {},
  };
  constructor(props) {
    super(props);
    this.onSelect = this.props.onSelect;
    this.item = this.props.item;
  }

  createTag = (item) => {
    item.tags.map(tag => tag.name).join(', ');
  };

  render() {
    return (
      <TouchableHighlight onPress={() => this.onSelect()}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Image source={{ uri: this.item.user.profile_image_url }} style={styles.thumbnail} />
            <Text style={styles.name}>{this.item.user.id}</Text>
          </View>
          <Text style={styles.title}>{this.item.title}</Text>
          <Text style={styles.tag}>{this.item.tags.map(tag => tag.name).join(', ')}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

QiitaCell.propTypes = {
  onSelect: PropTypes.func,
  item: PropTypes.object,
};
