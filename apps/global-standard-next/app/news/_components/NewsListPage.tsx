import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { newsListHref } from "@/lib/news";
import type { NewsCategory, NewsPost } from "@/lib/queries/news";
import { NewsListItem } from "./NewsListItem";
import { NewsPagination } from "./NewsPagination";
import { NewsSidebar } from "./NewsSidebar";

interface NewsListPageProps {
  /** このページに並べる記事（ページ送り・カテゴリ絞り込み済み） */
  posts: NewsPost[];
  /** 新しい順の全記事。サイドバーの「新着情報」に使う */
  allPosts: NewsPost[];
  categories: NewsCategory[];
  currentPage: number;
  totalPages: number;
  /** カテゴリ別ページのときだけ渡す。見出し・パンくず・ページ送りの行き先が変わる */
  currentCategory?: NewsCategory;
}

export function NewsListPage({
  posts,
  allPosts,
  categories,
  currentPage,
  totalPages,
  currentCategory,
}: NewsListPageProps) {
  // Figmaにカテゴリ別ページのデザインは無いため、一覧と同じ組みのまま
  // 見出しとパンくずの末尾だけをカテゴリ名に差し替える
  const heading = currentCategory ? currentCategory.name : "お知らせ";
  const breadcrumbItems = currentCategory
    ? [{ label: "お知らせ", href: "/news" }, { label: currentCategory.name }]
    : [{ label: "お知らせ" }];

  return (
    <main className="flex flex-col">
      <SiteHeader />
      <PageHero
        eyebrow="NEWS"
        title="お知らせ"
        imagePcSrc="/images/news/hero-pc.webp"
        imageSpSrc="/images/news/hero-sp.webp"
      />
      <Breadcrumb items={breadcrumbItems} />

      <div className="px-5 pt-[60px] pb-[100px] lg:px-[90px] lg:pt-[70px] lg:pb-40">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-[100px] lg:flex-row lg:items-start lg:gap-10">
          {/* PCは本文760px＋サイドバー300pxだが、1280px未満でも収まるよう本文側を可変にする */}
          <div className="flex flex-col items-center gap-10 lg:min-w-0 lg:flex-1 lg:gap-[60px]">
            <section className="flex w-full flex-col gap-[25px] lg:gap-5">
              <h2 className="text-xl leading-[1.2] font-bold text-contrast lg:text-[32px] lg:leading-10">
                {heading}
              </h2>
              <ul className="flex flex-col gap-5 lg:gap-10">
                {posts.map((post) => (
                  <li key={post.slug}>
                    {/* 詳細ページが未実装のため、いまはリンクにしない */}
                    <NewsListItem post={post} />
                  </li>
                ))}
              </ul>
            </section>

            <NewsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              buildHref={(page) => newsListHref(page, currentCategory?.slug)}
            />
          </div>

          <NewsSidebar
            posts={allPosts}
            categories={categories}
            currentCategorySlug={currentCategory?.slug}
          />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
