// @flow
import type { PagingResponse, QiitaTagsModel, QiitaItemsModel } from '../../flow-type';

export function parseItems(response: PagingResponse): QiitaItemsModel {
  const { totalCount, items } = response;
  return {
    totalCount,
    items: items.map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      user: item.user,
      tags: item.tags,
      createdAt: new Date(item.created_at),
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
