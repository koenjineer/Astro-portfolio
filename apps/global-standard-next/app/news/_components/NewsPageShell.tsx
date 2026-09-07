import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { NewsCategory, NewsPost } from "@/lib/queries/news";
import { NewsSidebar } from "./NewsSidebar";

interface NewsPageShellProps {
  /** 「トップ」の後ろに続く項目。先頭の「トップ」はBreadcrumbが自分で付ける */
  breadcrumbItems: BreadcrumbItem[];
  /** 新しい順の全記事。サイドバーの「新着情報」に使う */
  allPosts: NewsPost[];
  categories: NewsCategory[];
  /** カテゴリ別ページで、今見ているカテゴリを現在地として示す */
  currentCategorySlug?: string;
  children: ReactNode;
}

/**
 * お知らせの一覧と記事で共通の外枠。Figmaでは2ページとも
 * 本文760px＋サイドバー300px・同じ余白なので、寸法を1か所にまとめる。
 */
export function NewsPageShell({
  breadcrumbItems,
  allPosts,
  categories,
  currentCategorySlug,
  children,
}: NewsPageShellProps) {
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
          <div className="lg:min-w-0 lg:flex-1">{children}</div>

          <NewsSidebar
            posts={allPosts}
            categories={categories}
            currentCategorySlug={currentCategorySlug}
          />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
