import type { Metadata } from "next";
import { getBlogCategories } from "@/lib/queries/blog";
import {
  BlogListPage,
  findBlogCategory,
} from "../../_components/BlogListPage";
import { blogMetaTitle } from "../../_components/blogConfig";

/** 記事が1件以上あるカテゴリーだけを書き出す（サイドバーに出すカテゴリーと同じ） */
export async function generateStaticParams() {
  const categories = await getBlogCategories();

  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[slug]">): Promise<Metadata> {
  const category = await findBlogCategory((await params).slug);

  return { title: category ? blogMetaTitle(category.name) : blogMetaTitle() };
}

export default async function BlogCategoryPage({
  params,
}: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;

  return <BlogListPage page={1} categorySlug={slug} />;
}
