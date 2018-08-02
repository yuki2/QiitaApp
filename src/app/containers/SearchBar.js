import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import { PRIMARY_COLOR } from '../design';

const styles = StyleSheet.create({
  container: {
    backgroundColor: PRIMARY_COLOR,
    height: 40,
    padding: 5,
  },
  textInput: {
    height: 30,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    textAlign: 'left',
    borderColor: '#444',
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    fontSize: 13,
  },
});

type Props = {
  onChangeText: (text: string) => void,
};

const SearchBar = (props: Props) => {
  const { onChangeText } = props;
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        placeholder="Search"
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

export default SearchBar;
