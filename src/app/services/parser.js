// @flow
import _ from 'lodash';
import type { QiitaTagsModel, QiitaItemsModel, QiitaUser } from '../flow-type';

const getString = (response: any, path: string): string => {
  const value = _.get(response, path, '');
  return _.toString(value);
};

const getNumber = (response: any, path: string): number => {
  const value = _.get(response, path, 0);
  return _.toNumber(value);
};

export function parseUser(response: any): QiitaUser {
  return {
    description: getString(response, 'description'),
    facebookId: getString(response, 'facebook_id'),
    followeesCount: getNumber(response, 'followees_count'),
    followersCount: getNumber(response, 'followers_count'),
    githubLoginName: getString(response, 'github_login_name'),
    id: getString(response, 'id'),
    itemsCount: getNumber(response, 'items_count'),
    name: getString(response, 'name'),
    organization: getString(response, 'organization'),
    permanentId: getNumber(response, 'permanent_id'),
    profileImageUrl: getString(response, 'profile_image_url'),
    twitterScreenName: getString(response, 'twitter_screen_name'),
    websiteUrl: getString(response, 'website_url'),
  };
}

export function parseItems(response: any): QiitaItemsModel {
  const totalCount = _.get(response, 'totalCount', 0);
  const items = _.get(response, 'items', []);
  const totalCountNum: number = _.toNumber(totalCount);
  const itemsArray: Array<any> = _.toArray(items);
  return {
    totalCount: totalCountNum,
    items: itemsArray.map(item => ({
      id: getString(item, 'id'),
      title: getString(item, 'title'),
      url: getString(item, 'url'),
      user: parseUser(item.user),
      tags: _.isArray(item.tags) ? item.tags : [],
      createdAt: item.created_at ? new Date(item.created_at) : null,
      likesCount: getNumber(item, 'likes_count'),
    })),
  };
}

export function parseTags(response: any): QiitaTagsModel {
  const totalCount = _.get(response, 'totalCount', 0);
  const items = _.get(response, 'items', []);
  const totalCountNum: number = _.toNumber(totalCount);
  const itemsArray: Array<any> = _.toArray(items);
  return {
    totalCount: totalCountNum,
    tags: itemsArray.map(item => ({
      id: getString(item, 'id'),
      iconUrl: getString(item, 'icon_url'),
    })),
  };
}
