import { ArchiveListPage } from "@/components/archive/ArchiveListPage";
import {
  BLOG_PER_PAGE,
  getBlogCategories,
  getBlogPosts,
  type BlogCategory,
} from "@/lib/queries/blog";
import { BLOG_EYEBROW, BLOG_ROUTES, BLOG_TITLE } from "./blogConfig";

/** slugからカテゴリーを探す。WordPressに無い（記事が0件で返ってこない）slugなら undefined */
export async function findBlogCategory(
  slug: string
): Promise<BlogCategory | undefined> {
  return (await getBlogCategories()).find((category) => category.slug === slug);
}

interface BlogListPageProps {
  /** 1始まりのページ番号 */
  page: number;
  /** カテゴリー別の一覧のときだけ渡す */
  categorySlug?: string;
}

/**
 * ブログの一覧とカテゴリー別一覧（4ルート共通）。記事とカテゴリーを取って、お知らせと共通の組み立て
 * （ArchiveListPage）に渡す。ルートの側はページ番号とカテゴリーのslugを渡すだけにする（4か所に同じ手順を書かないため）
 */
export async function BlogListPage({ page, categorySlug }: BlogListPageProps) {
  const [allPosts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);

  return (
    <ArchiveListPage
      page={page}
      categorySlug={categorySlug}
      allPosts={allPosts}
      categories={categories}
      routes={BLOG_ROUTES}
      title={BLOG_TITLE}
      eyebrow={BLOG_EYEBROW}
      perPage={BLOG_PER_PAGE}
    />
  );
}
