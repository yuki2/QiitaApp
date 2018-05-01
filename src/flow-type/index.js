// @flow
export type QiitaItem = {
  id: string,
  title: string,
  url: string,
  user: any,
  tags: any,
  createdAt: Date,
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
