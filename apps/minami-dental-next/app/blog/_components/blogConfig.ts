import { archiveMetaTitle } from "@/components/archive/archiveMetaTitle";
import type { ArchiveRoutes } from "@/components/archive/types";
import { listHref } from "@/lib/pagination";

const BLOG_BASE_PATH = "/blog";

/** ページ上部の見出し。Figmaでは一覧・カテゴリー別・詳細の3画面とも同じ */
export const BLOG_TITLE = "スタッフブログ";
export const BLOG_EYEBROW = "STAFF BLOG";

/** ブログの記事・一覧のURL。`trailingSlash: true` に合わせて末尾スラッシュ付きで返す */
export const BLOG_ROUTES: ArchiveRoutes = {
  post: (slug) => `${BLOG_BASE_PATH}/${slug}/`,
  list: (page, categorySlug) => listHref(BLOG_BASE_PATH, page, categorySlug),
};

/** `<title>`。「記事名やカテゴリー名 | スタッフブログ | みなみ歯科」の順に並べる */
export function blogMetaTitle(...leadingParts: string[]): string {
  return archiveMetaTitle(BLOG_TITLE, ...leadingParts);
}
