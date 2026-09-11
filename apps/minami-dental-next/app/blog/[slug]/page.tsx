import type { Metadata } from "next";
import { ArchiveArticle } from "@/components/archive/ArchiveArticle";
import { ArchivePageShell } from "@/components/archive/ArchivePageShell";
import { ArchiveSidebar } from "@/components/archive/ArchiveSidebar";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { getAdjacentItems } from "@/lib/pagination";
import {
  getBlogCategories,
  getBlogPost,
  getBlogPosts,
} from "@/lib/queries/blog";
import {
  BLOG_EYEBROW,
  BLOG_ROUTES,
  BLOG_TITLE,
  blogMetaTitle,
} from "../_components/blogConfig";

/** 公開中の記事を全件書き出す */
export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  return { title: blogMetaTitle(post.title) };
}

export default async function BlogDetailPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, allPosts, categories] = await Promise.all([
    getBlogPost(slug),
    getBlogPosts(),
    getBlogCategories(),
  ]);
  const { older, newer } = getAdjacentItems(allPosts, slug);

  // Figmaのパンくずは「ホーム ＞ スタッフブログ ＞ カテゴリー ＞ 記事名」
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: BLOG_TITLE, href: BLOG_ROUTES.list(1) },
    ...(post.category
      ? [
          {
            label: post.category.name,
            href: BLOG_ROUTES.list(1, post.category.slug),
          },
        ]
      : []),
    { label: post.title },
  ];

  // Figmaの詳細にはアイキャッチの大きな画像が無いので、記事の本体（ArchiveArticle）は写真を出さない
  return (
    <ArchivePageShell
      title={BLOG_TITLE}
      eyebrow={BLOG_EYEBROW}
      // 記事名をh1にするので、ページ上部の「スタッフブログ」はh1にしない
      heroTitleAs="p"
      breadcrumbItems={breadcrumbItems}
      sidebar={
        <ArchiveSidebar
          posts={allPosts}
          categories={categories}
          routes={BLOG_ROUTES}
        />
      }
    >
      <ArchiveArticle
        post={post}
        listHref={BLOG_ROUTES.list(1)}
        olderHref={older ? BLOG_ROUTES.post(older.slug) : undefined}
        newerHref={newer ? BLOG_ROUTES.post(newer.slug) : undefined}
      />
    </ArchivePageShell>
  );
}
