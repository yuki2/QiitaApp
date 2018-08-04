// @flow

export type QiitaUser = {
  description: string,
  facebookId: string,
  followeesCount: number,
  followersCount: number,
  githubLoginName: string,
  id: string,
  itemsCount: number,
  name: string,
  organization: string,
  permanentId: number,
  profileImageUrl: string,
  twitterScreenName: string,
  websiteUrl: string,
};

export type QiitaItem = {
  id: string,
  title: string,
  url: string,
  user: QiitaUser,
  tags: Array<any>,
  createdAt: ?Date,
  likesCount: number,
};

export type QiitaItemsModel = {
  totalCount: number,
  items: Array<QiitaItem>,
};

export type QiitaTag = {
  id: string,
  iconUrl: string,
};

export type QiitaTagsModel = {
  totalCount: number,
  tags: Array<QiitaTag>,
};

export type PagingResponse = { totalCount: number, items: Array<any> };
