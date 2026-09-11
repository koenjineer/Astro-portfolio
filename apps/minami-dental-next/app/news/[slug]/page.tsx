import type { Metadata } from "next";
import { ArchiveArticle } from "@/components/archive/ArchiveArticle";
import { ArchivePageShell } from "@/components/archive/ArchivePageShell";
import { ArchiveSidebar } from "@/components/archive/ArchiveSidebar";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { getAdjacentItems } from "@/lib/pagination";
import {
  getNewsCategories,
  getNewsPost,
  getNewsPosts,
} from "@/lib/queries/news";
import {
  NEWS_EYEBROW,
  NEWS_ROUTES,
  NEWS_TITLE,
  newsMetaTitle,
} from "../_components/newsConfig";

/** 公開中の投稿を全件書き出す */
export async function generateStaticParams() {
  const posts = await getNewsPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  return { title: newsMetaTitle(post.title) };
}

export default async function NewsDetailPage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const [post, allPosts, categories] = await Promise.all([
    getNewsPost(slug),
    getNewsPosts(),
    getNewsCategories(),
  ]);
  const { older, newer } = getAdjacentItems(allPosts, slug);

  // Figmaのパンくずは「ホーム ＞ お知らせ ＞ カテゴリー ＞ 記事名」
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: NEWS_TITLE, href: NEWS_ROUTES.list(1) },
    ...(post.category
      ? [
          {
            label: post.category.name,
            href: NEWS_ROUTES.list(1, post.category.slug),
          },
        ]
      : []),
    { label: post.title },
  ];

  return (
    <ArchivePageShell
      title={NEWS_TITLE}
      eyebrow={NEWS_EYEBROW}
      // 記事名をh1にするので、ページ上部の「お知らせ」はh1にしない
      heroTitleAs="p"
      breadcrumbItems={breadcrumbItems}
      sidebar={
        <ArchiveSidebar
          posts={allPosts}
          categories={categories}
          routes={NEWS_ROUTES}
        />
      }
    >
      <ArchiveArticle
        post={post}
        listHref={NEWS_ROUTES.list(1)}
        olderHref={older ? NEWS_ROUTES.post(older.slug) : undefined}
        newerHref={newer ? NEWS_ROUTES.post(newer.slug) : undefined}
      />
    </ArchivePageShell>
  );
}
