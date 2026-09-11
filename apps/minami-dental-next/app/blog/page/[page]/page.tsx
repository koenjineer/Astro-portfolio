import type { Metadata } from "next";
import { paginate } from "@/lib/pagination";
import { BLOG_PER_PAGE, getBlogPosts } from "@/lib/queries/blog";
import { BlogListPage } from "../../_components/BlogListPage";
import { blogMetaTitle } from "../../_components/blogConfig";

/**
 * 1ページ目から全ページを書き出す。`output: export` では generateStaticParams が
 * 空配列を返すとビルドが止まるため、記事が9件以下（＝2ページ目が無い）になっても
 * 壊れないよう1ページ目を含める。`/blog/page/1/` は `/blog/` と同じ内容だが、どこからもリンクしない
 */
export async function generateStaticParams() {
  const { totalPages } = paginate(await getBlogPosts(), 1, BLOG_PER_PAGE);

  return Array.from({ length: totalPages }, (_, index) => ({
    page: String(index + 1),
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/page/[page]">): Promise<Metadata> {
  const { page } = await params;

  return { title: blogMetaTitle(`${page}ページ目`) };
}

export default async function BlogPagedPage({
  params,
}: PageProps<"/blog/page/[page]">) {
  const { page } = await params;

  return <BlogListPage page={Number(page)} />;
}
