import type { Metadata } from "next";
import { getNewsCategories } from "@/lib/queries/news";
import {
  findNewsCategory,
  NewsListPage,
} from "../../_components/NewsListPage";
import { newsMetaTitle } from "../../_components/newsConfig";

/** 記事が1件以上あるカテゴリーだけを書き出す（サイドバーに出すカテゴリーと同じ） */
export async function generateStaticParams() {
  const categories = await getNewsCategories();

  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/category/[slug]">): Promise<Metadata> {
  const category = await findNewsCategory((await params).slug);

  return { title: category ? newsMetaTitle(category.name) : newsMetaTitle() };
}

export default async function NewsCategoryPage({
  params,
}: PageProps<"/news/category/[slug]">) {
  const { slug } = await params;

  return <NewsListPage page={1} categorySlug={slug} />;
}
