import type { Metadata } from "next";
import {
  getAdjacentNewsPosts,
  getNewsCategories,
  getNewsPost,
  getNewsPosts,
} from "@/lib/queries/news";
import { NewsArticle } from "../_components/NewsArticle";
import { NewsPageShell } from "../_components/NewsPageShell";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** 公開中の投稿を全件書き出す */
export async function generateStaticParams() {
  const posts = await getNewsPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  return { title: `${post.title} | お知らせ | Global Standard` };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getNewsPost(slug),
    getNewsPosts(),
  ]);

  // Figmaのパンくずは「トップ ＞ お知らせ ＞ カテゴリ ＞ 記事名」
  const breadcrumbItems = [
    { label: "お知らせ", href: "/news" },
    ...(post.category
      ? [
          {
            label: post.category.name,
            href: `/news/category/${post.category.slug}`,
          },
        ]
      : []),
    { label: post.title },
  ];

  return (
    <NewsPageShell
      breadcrumbItems={breadcrumbItems}
      allPosts={allPosts}
      categories={getNewsCategories(allPosts)}
    >
      <NewsArticle
        post={post}
        adjacent={getAdjacentNewsPosts(allPosts, slug)}
      />
    </NewsPageShell>
  );
}
