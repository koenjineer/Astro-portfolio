import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  filterNewsByCategory,
  getNewsCategories,
  getNewsPosts,
  paginateNews,
} from "@/lib/queries/news";
import { NewsListPage } from "../../_components/NewsListPage";

interface NewsCategoryPageProps {
  params: Promise<{ slug: string }>;
}

/** 記事が1件以上あるカテゴリだけを書き出す（サイドバーに出すカテゴリと同じ） */
export async function generateStaticParams() {
  const categories = getNewsCategories(await getNewsPosts());

  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: NewsCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getNewsCategories(await getNewsPosts()).find(
    (item) => item.slug === slug
  );

  return {
    title: `${category?.name ?? "お知らせ"} | お知らせ | Global Standard`,
  };
}

export default async function NewsCategoryPage({
  params,
}: NewsCategoryPageProps) {
  const { slug } = await params;
  const allPosts = await getNewsPosts();
  const categories = getNewsCategories(allPosts);
  const currentCategory = categories.find((item) => item.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  const { posts, totalPages } = paginateNews(
    filterNewsByCategory(allPosts, slug),
    1
  );

  return (
    <NewsListPage
      posts={posts}
      allPosts={allPosts}
      categories={categories}
      currentPage={1}
      totalPages={totalPages}
      currentCategory={currentCategory}
    />
  );
}
