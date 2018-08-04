import React from 'react';
import renderer from 'react-test-renderer';
import QiitaIndicator from '../QiitaIndicator';

it('renders correctly', () => {
  const tree = renderer.create(<QiitaIndicator />).toJSON();
  expect(tree).toMatchSnapshot();
});
