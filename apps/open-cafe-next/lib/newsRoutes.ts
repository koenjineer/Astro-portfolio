/**
 * お知らせのURLと、一覧・カテゴリー別・詳細で共通の見出し・写真。
 *
 * カテゴリー別だけURLの根元が `/archives/category/…` と違う（指示書どおり。CLAUDE.mdのURL設計）ので、
 * 行き先の作り方をここ1か所に集め、ページごとに書かない
 */

/** Figmaでは一覧・カテゴリー別・詳細の3画面とも上部の見出しが同じ */
export const NEWS_TITLE = "お知らせ";
/** 英字の見出し。CSSで大文字にするのでFigmaの原稿どおり小文字で持つ */
export const NEWS_EYEBROW = "news";

export const NEWS_HERO_IMAGE_PC_SRC = "/images/firstview/news-pc.webp";
export const NEWS_HERO_IMAGE_SP_SRC = "/images/firstview/news-sp.webp";

const NEWS_BASE_PATH = "/news";
const CATEGORY_BASE_PATH = "/archives/category";

/** `next.config.ts` の `trailingSlash: true` に合わせ、どれも末尾スラッシュ付きで返す */
function pagedHref(basePath: string, page: number): string {
  // 1ページ目に `page/1/` を付けない。同じ内容のURLを2つ作らないため
  return page <= 1 ? `${basePath}/` : `${basePath}/page/${page}/`;
}

export function newsPostHref(slug: string): string {
  return `${NEWS_BASE_PATH}/${slug}/`;
}

export function newsListHref(page: number = 1): string {
  return pagedHref(NEWS_BASE_PATH, page);
}

export function newsCategoryHref(slug: string, page: number = 1): string {
  return pagedHref(`${CATEGORY_BASE_PATH}/${slug}`, page);
}

/**
 * `<title>`。ルートのlayoutが「◯◯ | OPEN CAFE」に整えるので、ここではサイト名を付けない。
 * 記事名・カテゴリー名は「◯◯ | お知らせ」の順に並べる
 */
export function newsMetaTitle(...leadingParts: string[]): string {
  return [...leadingParts, NEWS_TITLE].join(" | ");
}
