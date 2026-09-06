import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getNewsCategories,
  getNewsPosts,
  paginateNews,
} from "@/lib/queries/news";
import { NewsListPage } from "../../_components/NewsListPage";

interface NewsPagedPageProps {
  params: Promise<{ page: string }>;
}

/**
 * 1ページ目から全ページを書き出す。`output: export` では generateStaticParams が
 * 空配列を返すとビルドが止まるため、記事が9件以下（＝2ページ目が無い）でも
 * 壊れないよう1ページ目を含める。
 * `/news/page/1` は `/news` と同じ内容になるが、どこからもリンクしない。
 */
export async function generateStaticParams() {
  const { totalPages } = paginateNews(await getNewsPosts(), 1);

  return Array.from({ length: totalPages }, (_, index) => ({
    page: String(index + 1),
  }));
}

export async function generateMetadata({
  params,
}: NewsPagedPageProps): Promise<Metadata> {
  const { page } = await params;

  return { title: `お知らせ（${page}ページ目） | Global Standard` };
}

export default async function NewsPagedPage({ params }: NewsPagedPageProps) {
  const currentPage = Number((await params).page);
  const allPosts = await getNewsPosts();
  const { posts, totalPages } = paginateNews(allPosts, currentPage);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <NewsListPage
      posts={posts}
      allPosts={allPosts}
      categories={getNewsCategories(allPosts)}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
