import React from 'react';
import renderer from 'react-test-renderer';
import QiitaCell from '../QiitaCell';

const user = {
  description: 'description',
  facebookId: 'facebookId',
  followeesCount: 1,
  followersCount: 1,
  githubLoginName: 'githubLoginName',
  id: 'id',
  itemsCount: 1,
  name: 'name',
  organization: 'organization',
  permanentId: 'permanentId',
  profileImageUrl: 'profileImageUrl',
  twitterScreenName: 'twitterScreenName',
  websiteUrl: 'websiteUrl',
};

const item = {
  id: 'id',
  title: 'title',
  url: 'url',
  user,
  tags: ['tag1', 'tag2'],
  likesCount: 1,
};

it('renders correctly', () => {
  const onSelectItem = () => {};
  const tree = renderer.create(<QiitaCell onSelect={onSelectItem} item={item} />).toJSON();
  expect(tree).toMatchSnapshot();
});
