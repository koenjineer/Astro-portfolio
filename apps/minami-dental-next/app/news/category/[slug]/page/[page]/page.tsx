import type { Metadata } from "next";
import { filterByCategory, paginate } from "@/lib/pagination";
import {
  getNewsCategories,
  getNewsPosts,
  NEWS_PER_PAGE,
} from "@/lib/queries/news";
import {
  findNewsCategory,
  NewsListPage,
} from "../../../../_components/NewsListPage";
import { newsMetaTitle } from "../../../../_components/newsConfig";

/**
 * カテゴリー×ページ番号の組み合わせを書き出す。`/news/page/[page]` と同じ理由で1ページ目も含める
 * （今はどのカテゴリーも9件以下で2ページ目が1つも無く、1ページ目を外すと空配列になりビルドが止まる）
 */
export async function generateStaticParams() {
  const [allPosts, categories] = await Promise.all([
    getNewsPosts(),
    getNewsCategories(),
  ]);

  return categories.flatMap((category) => {
    const { totalPages } = paginate(
      filterByCategory(allPosts, category.slug),
      1,
      NEWS_PER_PAGE
    );

    return Array.from({ length: totalPages }, (_, index) => ({
      slug: category.slug,
      page: String(index + 1),
    }));
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/news/category/[slug]/page/[page]">): Promise<Metadata> {
  const { slug, page } = await params;
  const category = await findNewsCategory(slug);
  const pageLabel = `${page}ページ目`;

  return {
    title: category
      ? newsMetaTitle(pageLabel, category.name)
      : newsMetaTitle(pageLabel),
  };
}

export default async function NewsCategoryPagedPage({
  params,
}: PageProps<"/news/category/[slug]/page/[page]">) {
  const { slug, page } = await params;

  return <NewsListPage page={Number(page)} categorySlug={slug} />;
}
