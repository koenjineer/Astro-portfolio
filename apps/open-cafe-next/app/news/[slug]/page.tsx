import type { Metadata } from "next";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { NewsArticle } from "@/components/news/NewsArticle";
import { RelatedNews } from "@/components/news/RelatedNews";
import {
  NEWS_EYEBROW,
  NEWS_HERO_IMAGE_PC_SRC,
  NEWS_HERO_IMAGE_SP_SRC,
  NEWS_TITLE,
  newsCategoryHref,
  newsListHref,
  newsMetaTitle,
  newsPostHref,
} from "@/lib/newsRoutes";
import { getAdjacentItems } from "@/lib/pagination";
import {
  getNewsPost,
  getNewsPosts,
  getRelatedNewsPosts,
} from "@/lib/queries/news";

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
  const [post, allPosts] = await Promise.all([
    getNewsPost(slug),
    getNewsPosts(),
  ]);
  const { older, newer } = getAdjacentItems(allPosts, slug);

  // Figmaのパンくずは「TOP ＞ お知らせ ＞ カテゴリー ＞ 記事名」
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: NEWS_TITLE, href: newsListHref() },
    { label: post.category.name, href: newsCategoryHref(post.category.slug) },
    { label: post.title },
  ];

  return (
    <SubPageLayout
      title={NEWS_TITLE}
      // 記事名をh1にするので、上部の「お知らせ」はh1にしない
      titleAs="p"
      eyebrow={NEWS_EYEBROW}
      imagePcSrc={NEWS_HERO_IMAGE_PC_SRC}
      imageSpSrc={NEWS_HERO_IMAGE_SP_SRC}
      breadcrumbItems={breadcrumbItems}
    >
      {/* 詳細にサイドバーは無く、本文だけを688pxで中央に置く。記事と関連記事の間はSP 100px / PC 120px */}
      <div className="mx-auto flex w-full max-w-[688px] flex-col gap-[100px] md:gap-[120px]">
        <NewsArticle
          post={post}
          listHref={newsListHref()}
          olderHref={older ? newsPostHref(older.slug) : undefined}
          newerHref={newer ? newsPostHref(newer.slug) : undefined}
        />
        <RelatedNews posts={getRelatedNewsPosts(allPosts, post)} />
      </div>
    </SubPageLayout>
  );
}
