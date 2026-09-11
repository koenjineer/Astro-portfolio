import { ArchiveListPage } from "@/components/archive/ArchiveListPage";
import {
  getNewsCategories,
  getNewsPosts,
  NEWS_PER_PAGE,
  type NewsCategory,
} from "@/lib/queries/news";
import { NEWS_EYEBROW, NEWS_ROUTES, NEWS_TITLE } from "./newsConfig";

/** slugからカテゴリーを探す。WordPressに無い（記事が0件で返ってこない）slugなら undefined */
export async function findNewsCategory(
  slug: string
): Promise<NewsCategory | undefined> {
  return (await getNewsCategories()).find((category) => category.slug === slug);
}

interface NewsListPageProps {
  /** 1始まりのページ番号 */
  page: number;
  /** カテゴリー別の一覧のときだけ渡す */
  categorySlug?: string;
}

/**
 * お知らせの一覧とカテゴリー別一覧（4ルート共通）。記事とカテゴリーを取って、ブログと共通の組み立て
 * （ArchiveListPage）に渡す。ルートの側はページ番号とカテゴリーのslugを渡すだけにする（4か所に同じ手順を書かないため）
 */
export async function NewsListPage({ page, categorySlug }: NewsListPageProps) {
  const [allPosts, categories] = await Promise.all([
    getNewsPosts(),
    getNewsCategories(),
  ]);

  return (
    <ArchiveListPage
      page={page}
      categorySlug={categorySlug}
      allPosts={allPosts}
      categories={categories}
      routes={NEWS_ROUTES}
      title={NEWS_TITLE}
      eyebrow={NEWS_EYEBROW}
      perPage={NEWS_PER_PAGE}
    />
  );
}
