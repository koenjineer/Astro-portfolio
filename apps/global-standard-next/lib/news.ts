/** Figmaの一覧は1ページ9件（記事15件で「1 2」の2ページになる） */
export const NEWS_PER_PAGE = 9;

/**
 * サイドバーに出すカテゴリの表示順。WordPressが返す既定の並びは名前順で、
 * Figmaの「新着情報 → 受講の声 → セミナー → 研修プログラム」と一致しないためslugで固定する。
 * この配列に無いslug（WordPress既定の`uncategorized`など）は表示にも絞り込みにも使わない。
 */
export const NEWS_CATEGORY_SLUG_ORDER = [
  "new",
  "interview",
  "seminar",
  "program",
];

/**
 * お知らせ一覧のURL。1ページ目だけ`/page/1`を付けず、正規のURLを1つに保つ。
 * カテゴリ指定なしなら全件の一覧を指す。
 */
export function newsListHref(page: number, categorySlug?: string): string {
  const base = categorySlug ? `/news/category/${categorySlug}` : "/news";

  return page <= 1 ? base : `${base}/page/${page}`;
}
