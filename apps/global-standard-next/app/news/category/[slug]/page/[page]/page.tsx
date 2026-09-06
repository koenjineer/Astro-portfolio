import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  filterNewsByCategory,
  getNewsCategories,
  getNewsPosts,
  paginateNews,
} from "@/lib/queries/news";
import { NewsListPage } from "../../../../_components/NewsListPage";

interface NewsCategoryPagedPageProps {
  params: Promise<{ slug: string; page: string }>;
}

/**
 * カテゴリ×ページ番号の組み合わせを書き出す。`/news/page/[page]` と同じ理由で
 * 1ページ目も含める（現状はどのカテゴリも9件以下で、2ページ目が1つも生まれないため、
 * 1ページ目を外すと空配列になりビルドが止まる）。
 */
export async function generateStaticParams() {
  const allPosts = await getNewsPosts();

  return getNewsCategories(allPosts).flatMap((category) => {
    const { totalPages } = paginateNews(
      filterNewsByCategory(allPosts, category.slug),
      1
    );

    return Array.from({ length: totalPages }, (_, index) => ({
      slug: category.slug,
      page: String(index + 1),
    }));
  });
}

export async function generateMetadata({
  params,
}: NewsCategoryPagedPageProps): Promise<Metadata> {
  const { slug, page } = await params;
  const category = getNewsCategories(await getNewsPosts()).find(
    (item) => item.slug === slug
  );

  return {
    title: `${category?.name ?? "お知らせ"}（${page}ページ目） | お知らせ | Global Standard`,
  };
}

export default async function NewsCategoryPagedPage({
  params,
}: NewsCategoryPagedPageProps) {
  const { slug, page } = await params;
  const currentPage = Number(page);
  const allPosts = await getNewsPosts();
  const categories = getNewsCategories(allPosts);
  const currentCategory = categories.find((item) => item.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  const { posts, totalPages } = paginateNews(
    filterNewsByCategory(allPosts, slug),
    currentPage
  );

  if (posts.length === 0) {
    notFound();
  }

  return (
    <NewsListPage
      posts={posts}
      allPosts={allPosts}
      categories={categories}
      currentPage={currentPage}
      totalPages={totalPages}
      currentCategory={currentCategory}
    />
  );
}
