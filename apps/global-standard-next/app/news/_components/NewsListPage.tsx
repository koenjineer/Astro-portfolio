import { newsListHref } from "@/lib/news";
import type { NewsCategory, NewsPost } from "@/lib/queries/news";
import { NewsListItem } from "./NewsListItem";
import { NewsPageShell } from "./NewsPageShell";
import { NewsPagination } from "./NewsPagination";

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
    <NewsPageShell
      breadcrumbItems={breadcrumbItems}
      allPosts={allPosts}
      categories={categories}
      currentCategorySlug={currentCategory?.slug}
    >
      <div className="flex flex-col items-center gap-10 lg:gap-[60px]">
        <section className="flex w-full flex-col gap-[25px] lg:gap-5">
          <h2 className="text-xl leading-[1.2] font-bold text-contrast lg:text-[32px] lg:leading-10">
            {heading}
          </h2>
          <ul className="flex flex-col gap-5 lg:gap-10">
            {posts.map((post) => (
              <li key={post.slug}>
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
    </NewsPageShell>
  );
}
