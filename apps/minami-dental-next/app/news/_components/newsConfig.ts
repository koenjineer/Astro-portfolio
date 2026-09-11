import type { ArchiveRoutes } from "@/components/archive/types";
import { listHref } from "@/lib/pagination";

const NEWS_BASE_PATH = "/news";
const SITE_NAME = "みなみ歯科";

/** ページ上部の見出し。Figmaでは一覧・カテゴリー別・詳細の3画面とも同じ */
export const NEWS_TITLE = "お知らせ";
export const NEWS_EYEBROW = "NEWS";

/** お知らせの記事・一覧のURL。`trailingSlash: true` に合わせて末尾スラッシュ付きで返す */
export const NEWS_ROUTES: ArchiveRoutes = {
  post: (slug) => `${NEWS_BASE_PATH}/${slug}/`,
  list: (page, categorySlug) => listHref(NEWS_BASE_PATH, page, categorySlug),
};

/** `<title>`。「記事名やカテゴリー名 | お知らせ | みなみ歯科」の順に並べる */
export function newsMetaTitle(...leadingParts: string[]): string {
  return [...leadingParts, NEWS_TITLE, SITE_NAME].join(" | ");
}
