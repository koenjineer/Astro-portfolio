import type { Metadata } from "next";
import {
  getNewsCategories,
  getNewsPosts,
  paginateNews,
} from "@/lib/queries/news";
import { NewsListPage } from "./_components/NewsListPage";

export const metadata: Metadata = {
  title: "お知らせ | Global Standard",
};

export default async function NewsPage() {
  const allPosts = await getNewsPosts();
  const { posts, totalPages } = paginateNews(allPosts, 1);

  return (
    <NewsListPage
      posts={posts}
      allPosts={allPosts}
      categories={getNewsCategories(allPosts)}
      currentPage={1}
      totalPages={totalPages}
    />
  );
}
