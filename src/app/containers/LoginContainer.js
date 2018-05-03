// @flow
import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import { PRIMARY_COLOR } from '../design';
import { startLoginQiita } from '../modules/session';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    height: 300,
  },
  title: {
    fontSize: 50,
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  guestText: {
    marginTop: 20,
    color: 'white',
    textAlign: 'center',
  },
});

type Props = {
  onLoginPress: () => void,
  loginButtonDisable: boolean,
};

const mapStateToProps = state => ({
  loginButtonDisable: state.session.loading,
});

const mapDispatchToProps = dispatch => ({
  onLoginPress: () => {
    dispatch(startLoginQiita(true));
  },
});

export class Login extends PureComponent<Props> {
  static defaultProps = {
    onLoginPress: () => {},
  };

  render = () => {
    const { onLoginPress, loginButtonDisable } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>QiitaApp</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onLoginPress}
          disabled={loginButtonDisable}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
