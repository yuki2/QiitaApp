import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

const QiitaIndicator = () => <ActivityIndicator animating style={styles.loading} size="large" />;

export default QiitaIndicator;
