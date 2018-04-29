import React, { Component } from 'react';
import { Text, Button, View } from 'react-native';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { startLoginQiita } from '../modules/session';

const mapDispatchToProps = dispatch => ({
  onLoginPress: () => {
    dispatch(startLoginQiita(true));
  },
});

export class Login extends Component {
  static defaultProps = {
    onLoginPress: () => {},
  };
  static propTypes = {
    onLoginPress: PropTypes.func,
  };
  onLoginPress = () => {
    this.props.onLoginPress();
  };

  render = () => (
    <View>
      <Button large onPress={() => this.onLoginPress()} title="Continue">
        <Text> Continue</Text>
      </Button>
    </View>
  );
}

export default connect(null, mapDispatchToProps)(Login);
