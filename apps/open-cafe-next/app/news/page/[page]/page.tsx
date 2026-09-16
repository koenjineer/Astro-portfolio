import type { Metadata } from "next";
import { newsMetaTitle } from "@/lib/newsRoutes";
import { paginate } from "@/lib/pagination";
import { getNewsPosts, NEWS_PER_PAGE } from "@/lib/queries/news";
import { NewsListPage } from "../../_components/NewsListPage";

/**
 * 1ページ目から全ページを書き出す。`output: export` では `generateStaticParams` が空配列を返すと
 * ビルドが止まるため、記事が8件以下（＝2ページ目が無い）になっても壊れないよう1ページ目を含める。
 * `/news/page/1/` は `/news/` と同じ内容だが、どこからもリンクしない
 */
export async function generateStaticParams() {
  const { totalPages } = paginate(await getNewsPosts(), 1, NEWS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, index) => ({
    page: String(index + 1),
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/page/[page]">): Promise<Metadata> {
  const { page } = await params;

  return { title: newsMetaTitle(`${page}ページ目`) };
}

export default async function NewsPagedPage({
  params,
}: PageProps<"/news/page/[page]">) {
  const { page } = await params;

  return <NewsListPage page={Number(page)} />;
}
