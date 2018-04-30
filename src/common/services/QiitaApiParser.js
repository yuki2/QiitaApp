export const parseItems = (response) => {
  const { totalCount, items } = response;
  return {
    totalCount,
    items: items.map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      user: item.user,
      tags: item.tags,
      createdAt: item.created_at,
    })),
  };
};

export const parseTag = tag => ({});
