import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { newsListHref } from "@/lib/news";
import type { NewsCategory, NewsPost } from "@/lib/queries/news";
import { NewsListItem } from "./NewsListItem";

/** Figmaのサイドバー「新着情報」は4件 */
const LATEST_POST_COUNT = 4;

interface NewsSidebarProps {
  /** 新しい順の全記事。ここから先頭4件を「新着情報」に出す */
  posts: NewsPost[];
  categories: NewsCategory[];
  /** カテゴリ別ページで、今見ているカテゴリを現在地として示す */
  currentCategorySlug?: string;
}

export function NewsSidebar({
  posts,
  categories,
  currentCategorySlug,
}: NewsSidebarProps) {
  const latestPosts = posts.slice(0, LATEST_POST_COUNT);

  return (
    <aside className="flex flex-col gap-[60px] lg:w-[300px] lg:shrink-0 lg:gap-20">
      <section className="flex flex-col gap-[25px] lg:gap-4">
        <h2 className="text-xl leading-[1.2] font-bold text-contrast">
          新着情報
        </h2>
        <ul className="flex flex-col gap-5 lg:gap-4">
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <NewsListItem post={post} variant="sidebar" />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl leading-[1.2] font-bold text-contrast">
          カテゴリ
        </h2>
        {/* Figmaでは見出しの21px下に1本目の罫線が引かれ、各行の下にも罫線が続く */}
        <ul className="mt-[21px] border-t border-[#ddd]">
          {categories.map((category) => {
            const isCurrent = category.slug === currentCategorySlug;

            return (
              <li key={category.slug} className="border-b border-[#ddd]">
                <Link
                  href={newsListHref(1, category.slug)}
                  aria-current={isCurrent ? "page" : undefined}
                  className="group flex items-center gap-1 pt-[17px] pb-[15px] pl-[15px] text-base font-bold text-contrast transition-colors duration-300 hover:text-main focus-visible:text-main motion-reduce:transition-none"
                >
                  <ChevronRightIcon className="size-5 shrink-0 text-main transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" />
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
