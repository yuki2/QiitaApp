import { parseItems, parseTags, parseUser } from '../parser';

const mockUserJson = {
  description: 'description',
  facebook_id: 'facebook_id',
  followees_count: 1,
  followers_count: 2,
  github_login_name: 'github_login_name',
  id: 'id',
  items_count: 3,
  linkedin_id: 'linkedin_id',
  location: 'location',
  name: 'name',
  organization: 'organization',
  permanent_id: 4,
  profile_image_url: 'profile_image_url',
  twitter_screen_name: 'twitter_screen_name',
  website_url: 'website_url',
};

const mockItemJson = {
  id: 'id',
  title: 'title',
  url: 'url',
  user: mockUserJson,
  tags: ['tag1', 'tag2'],
  likes_count: 1,
};

const mockTagJson = {
  id: 'id',
  icon_url: 'icon_url',
};

describe('parser', () => {
  describe('parseUser', () => {
    it('parseUser correctly with invalid data', () => {
      const invalidData = [null, undefined, {}];
      const expected = {
        description: '',
        facebookId: '',
        followeesCount: 0,
        followersCount: 0,
        githubLoginName: '',
        id: '',
        itemsCount: 0,
        name: '',
        organization: '',
        permanentId: 0,
        profileImageUrl: '',
        twitterScreenName: '',
        websiteUrl: '',
      };
      invalidData.forEach((input) => {
        expect(parseUser(input)).toEqual(expected);
      });
    });

    it('parseUser correctly', () => {
      const expected = {
        description: 'description',
        facebookId: 'facebook_id',
        followeesCount: 1,
        followersCount: 2,
        githubLoginName: 'github_login_name',
        id: 'id',
        itemsCount: 3,
        name: 'name',
        organization: 'organization',
        permanentId: 4,
        profileImageUrl: 'profile_image_url',
        twitterScreenName: 'twitter_screen_name',
        websiteUrl: 'website_url',
      };
      expect(parseUser(mockUserJson)).toEqual(expected);
    });
  });

  describe('parseItems', () => {
    it('parseItems correctly with invalid data', () => {
      const invalidData = [null, undefined, {}];
      const expected = { totalCount: 0, items: [] };
      invalidData.forEach((input) => {
        expect(parseItems(input)).toEqual(expected);
      });
    });

    it('parseItems correctly', () => {
      const mockItems = {
        totalCount: 1,
        items: [mockItemJson],
      };
      const expectedUser = {
        description: 'description',
        facebookId: 'facebook_id',
        followeesCount: 1,
        followersCount: 2,
        githubLoginName: 'github_login_name',
        id: 'id',
        itemsCount: 3,
        name: 'name',
        organization: 'organization',
        permanentId: 4,
        profileImageUrl: 'profile_image_url',
        twitterScreenName: 'twitter_screen_name',
        websiteUrl: 'website_url',
      };
      const expectedItems = {
        totalCount: 1,
        items: [
          {
            id: 'id',
            title: 'title',
            url: 'url',
            user: expectedUser,
            tags: ['tag1', 'tag2'],
            createdAt: null,
            likesCount: 1,
          },
        ],
      };
      expect(parseItems(mockItems)).toEqual(expectedItems);
    });
  });

  describe('parseTags', () => {
    it('parseTags correctly with invalid data', () => {
      const invalidData = [null, undefined, {}];
      const expected = { totalCount: 0, tags: [] };
      invalidData.forEach((input) => {
        expect(parseTags(input)).toEqual(expected);
      });
    });

    it('parseTags correctly', () => {
      const mockTags = {
        totalCount: 1,
        items: [mockTagJson],
      };
      const expectedTag = {
        id: 'id',
        iconUrl: 'icon_url',
      };
      const expectedTags = {
        totalCount: 1,
        tags: [expectedTag],
      };
      expect(parseTags(mockTags)).toEqual(expectedTags);
    });
  });
});
