import React from 'react';
import renderer from 'react-test-renderer';
import SearchBar from '../SearchBar';

it('renders correctly', () => {
  const onChangeText = () => {};
  const tree = renderer.create(<SearchBar onChangeText={onChangeText} />).toJSON();
  expect(tree).toMatchSnapshot();
});
