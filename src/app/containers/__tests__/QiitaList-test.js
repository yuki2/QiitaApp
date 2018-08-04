import React from 'react';
import renderer from 'react-test-renderer';
import QiitaList from '../QiitaList';

const dummmyItem = (index) => {
  const user = {
    description: 'description',
    facebookId: 'facebookId',
    followeesCount: index,
    followersCount: index,
    githubLoginName: 'githubLoginName',
    id: `id${index}`,
    itemsCount: index,
    name: 'name',
    organization: 'organization',
    permanentId: 'permanentId',
    profileImageUrl: 'profileImageUrl',
    twitterScreenName: 'twitterScreenName',
    websiteUrl: 'websiteUrl',
  };
  return {
    id: `id${index}`,
    title: 'title',
    url: 'url',
    user,
    tags: ['tag1', 'tag2'],
    likesCount: index,
  };
};

it('renders correctly', () => {
  const items = [1, 2, 3, 4].map(index => dummmyItem(index));
  const tree = renderer.create(<QiitaList items={items} />).toJSON();
  expect(tree).toMatchSnapshot();
});
