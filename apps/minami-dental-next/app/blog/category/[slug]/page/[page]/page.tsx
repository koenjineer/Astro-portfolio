import type { Metadata } from "next";
import { filterByCategory, paginate } from "@/lib/pagination";
import {
  BLOG_PER_PAGE,
  getBlogCategories,
  getBlogPosts,
} from "@/lib/queries/blog";
import {
  BlogListPage,
  findBlogCategory,
} from "../../../../_components/BlogListPage";
import { blogMetaTitle } from "../../../../_components/blogConfig";

/**
 * カテゴリー×ページ番号の組み合わせを書き出す。`/blog/page/[page]` と同じ理由で1ページ目も含める
 * （今はどのカテゴリーも9件以下で2ページ目が1つも無く、1ページ目を外すと空配列になりビルドが止まる）
 */
export async function generateStaticParams() {
  const [allPosts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);

  return categories.flatMap((category) => {
    const { totalPages } = paginate(
      filterByCategory(allPosts, category.slug),
      1,
      BLOG_PER_PAGE
    );

    return Array.from({ length: totalPages }, (_, index) => ({
      slug: category.slug,
      page: String(index + 1),
    }));
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[slug]/page/[page]">): Promise<Metadata> {
  const { slug, page } = await params;
  const category = await findBlogCategory(slug);
  const pageLabel = `${page}ページ目`;

  return {
    title: category
      ? blogMetaTitle(pageLabel, category.name)
      : blogMetaTitle(pageLabel),
  };
}

export default async function BlogCategoryPagedPage({
  params,
}: PageProps<"/blog/category/[slug]/page/[page]">) {
  const { slug, page } = await params;

  return <BlogListPage page={Number(page)} categorySlug={slug} />;
}
