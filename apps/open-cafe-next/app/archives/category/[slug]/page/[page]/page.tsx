import type { Metadata } from "next";
import { newsMetaTitle } from "@/lib/newsRoutes";
import { paginate } from "@/lib/pagination";
import {
  getNewsCategories,
  getNewsPosts,
  NEWS_PER_PAGE,
} from "@/lib/queries/news";
import {
  findNewsCategory,
  NewsListPage,
} from "@/app/news/_components/NewsListPage";

/**
 * カテゴリーごとに、そのカテゴリーの記事数ぶんのページを書き出す。
 * 今のデータはどのカテゴリーも4件以下なので1ページ目だけになるが、記事が増えても
 * 2ページ目が自動でできるようにしておく（`generateStaticParams` は空配列を返せない）
 */
export async function generateStaticParams() {
  const [categories, allPosts] = await Promise.all([
    getNewsCategories(),
    getNewsPosts(),
  ]);

  return categories.flatMap((category) => {
    const { totalPages } = paginate(
      allPosts.filter((post) => post.category.slug === category.slug),
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
}: PageProps<"/archives/category/[slug]/page/[page]">): Promise<Metadata> {
  const { slug, page } = await params;
  const category = await findNewsCategory(slug);

  return {
    title: category
      ? newsMetaTitle(`${page}ページ目`, category.name)
      : newsMetaTitle(`${page}ページ目`),
  };
}

export default async function NewsCategoryPagedPage({
  params,
}: PageProps<"/archives/category/[slug]/page/[page]">) {
  const { slug, page } = await params;

  return <NewsListPage page={Number(page)} categorySlug={slug} />;
}
