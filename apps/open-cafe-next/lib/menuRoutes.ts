/**
 * メニューのURLと、一覧・ジャンル別で共通の見出し・写真。
 * ジャンル別だけURLの根元が `/genre/…` と違う（CLAUDE.mdのURL設計）ので、行き先の作り方をここに集める
 */

/** Figmaでは一覧・ジャンル別の両方で上部の見出しが同じ */
export const MENU_TITLE = "メニュー";
/** 英字の見出し。CSSで大文字にするのでFigmaの原稿どおり小文字で持つ */
export const MENU_EYEBROW = "menu";

export const MENU_HERO_IMAGE_PC_SRC = "/images/firstview/menu-pc.webp";
export const MENU_HERO_IMAGE_SP_SRC = "/images/firstview/menu-sp.webp";

// どちらも `next.config.ts` の `trailingSlash: true` に合わせて末尾スラッシュ付き
export const MENU_LIST_HREF = "/menu/";

export function genreHref(slug: string): string {
  return `/genre/${slug}/`;
}
