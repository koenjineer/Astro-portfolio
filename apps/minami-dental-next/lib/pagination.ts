// お知らせとブログで共通のページ送り・前後記事・一覧URL。
// 1ページの件数はFigmaのカンプで決まるため、ここでは持たず呼び出し側から渡す

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
  /** 1つ古い記事。WordPressの「前の記事」にあたる */
  older: Item | null;
  /** 1つ新しい記事 */
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

/**
 * 一覧のURL。1ページ目だけ`page/1/`を付けず、正規のURLを1つに保つ。
 * `next.config.ts` の `trailingSlash: true` に合わせて末尾スラッシュ付きで返す
 * （付けないとリンクのたびにリダイレクトが1回挟まる）。
 *
 * @param basePath 一覧のルート（例: `/news`）。末尾スラッシュの有無はどちらでもよい
 */
export function listHref(
  basePath: string,
  page: number,
  categorySlug?: string
): string {
  const root = basePath.replace(/\/+$/, "");
  const listRoot = categorySlug ? `${root}/category/${categorySlug}` : root;

  return page <= 1 ? `${listRoot}/` : `${listRoot}/page/${page}/`;
}
