// @flow
import type { PagingResponse, QiitaTagsModel, QiitaItemsModel, QiitaUser } from '../flow-type';

export function parseUser(response: any): QiitaUser {
  return {
    description: response.description,
    facebookId: response.facebook_id,
    followeesCount: response.followees_count,
    followersCount: response.followers_count,
    githubLoginName: response.github_login_name,
    id: response.id,
    itemsCount: response.items_count,
    name: response.name,
    organization: response.organization,
    permanentId: response.permanent_id,
    profileImageUrl: response.profile_image_url,
    twitterScreenName: response.twitter_screen_name,
    websiteUrl: response.website_url,
  };
}

export function parseItems(response: PagingResponse): QiitaItemsModel {
  const { totalCount, items } = response;
  return {
    totalCount,
    items: items.map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      user: parseUser(item.user),
      tags: item.tags,
      createdAt: new Date(item.created_at),
      likesCount: item.likes_count,
    })),
  };
}

export function parseTags(response: PagingResponse): QiitaTagsModel {
  const { totalCount, items } = response;
  return {
    totalCount,
    tags: items.map(item => ({
      id: item.id,
      iconUrl: item.icon_url,
    })),
  };
}
