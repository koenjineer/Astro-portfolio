// お知らせ一覧のページ送りと、詳細ページの前後記事。
// 1ページの件数はFigmaのカンプで決まるので、ここでは持たず呼び出し側から渡す

export interface PaginatedItems<Item> {
  items: Item[];
  totalPages: number;
}

/** `page` は1始まり。記事が0件でも「1ページ目だけある」扱いにし、空の一覧を出せるようにする */
export function paginate<Item>(
  items: Item[],
  page: number,
  perPage: number
): PaginatedItems<Item> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const startIndex = (page - 1) * perPage;

  return {
    items: items.slice(startIndex, startIndex + perPage),
    totalPages,
  };
}

export interface AdjacentItems<Item> {
  /** 1つ古い記事。Figmaの「前の記事」にあたる */
  older: Item | null;
  /** 1つ新しい記事。Figmaの「次の記事」にあたる */
  newer: Item | null;
}

/** `items` は新しい順。配列の後ろほど古い記事になる */
export function getAdjacentItems<Item extends { slug: string }>(
  items: Item[],
  slug: string
): AdjacentItems<Item> {
  const index = items.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return { older: null, newer: null };
  }

  return {
    older: items[index + 1] ?? null,
    newer: index > 0 ? items[index - 1] : null,
  };
}
