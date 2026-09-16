import Link from "next/link";
import type { ReactNode } from "react";
import { newsCategoryHref, newsPostHref } from "@/lib/newsRoutes";
import type { NewsCategory, NewsPost } from "@/lib/queries/news";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { NewsCard } from "./NewsCard";

/** Figmaのサイドバー「最近の投稿」は4件（19716:3597） */
const LATEST_POST_COUNT = 4;

// Figmaの箱の色。ルールセットの色（cr-*）には無い薄いグレーなので、そのまま値で書く
const SECTION_BOX = "flex flex-col gap-5 bg-[#f8f8f8] p-5";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

/** 見出し（文字＋32pxの短い下線。Figma: heading-sidebar）と中身の組 */
function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section className={SECTION_BOX}>
      <div className="flex flex-col gap-5">
        <h2 className="text-xl/[1.5] font-bold text-contrast">{title}</h2>
        <span aria-hidden="true" className="h-px w-8 bg-contrast" />
      </div>
      {children}
    </section>
  );
}

interface NewsSidebarProps {
  /** 新しい順の全記事。先頭4件を「最近の投稿」に出す */
  posts: NewsPost[];
  categories: NewsCategory[];
  /** カテゴリー別ページで、今見ているカテゴリーを現在地として示す */
  currentCategorySlug?: string;
}

/**
 * 一覧・カテゴリー別一覧の右側（Figma: sidebar 19716:3597）。
 * 詳細ページには無い。SPでは本文の下に回るので、幅や並び方は使う側が決める
 */
export function NewsSidebar({
  posts,
  categories,
  currentCategorySlug,
}: NewsSidebarProps) {
  const latestPosts = posts.slice(0, LATEST_POST_COUNT);

  return (
    <aside className="flex flex-col gap-[60px]">
      <SidebarSection title="最近の投稿">
        <ul className="flex flex-col gap-5">
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <NewsCard
                post={post}
                href={newsPostHref(post.slug)}
                variant="sidebar"
                titleAs="h3"
              />
            </li>
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection title="カテゴリ">
        <ul className="flex flex-col gap-2.5">
          {categories.map((category) => {
            const isCurrent = category.slug === currentCategorySlug;

            return (
              <li key={category.slug}>
                {/* 現在地はホバーと同じ見た目にし、読み上げには aria-current で伝える（ドロワーの項目と同じ考え方） */}
                <Link
                  href={newsCategoryHref(category.slug)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex w-fit items-center gap-1.5 text-base/[1.5] font-bold text-contrast transition-opacity duration-300 hover:opacity-70 focus-visible:opacity-70 motion-reduce:transition-none ${isCurrent ? "opacity-70" : ""}`}
                >
                  {/* shrink-0：リンクの幅（w-fit）の中で矢印が押し縮められないようにする */}
                  <ChevronRightIcon className="shrink-0" />
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </SidebarSection>
    </aside>
  );
}
