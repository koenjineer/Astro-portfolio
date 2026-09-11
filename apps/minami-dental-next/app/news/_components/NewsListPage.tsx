import { notFound } from "next/navigation";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { ArchivePageShell } from "@/components/archive/ArchivePageShell";
import { ArchivePagination } from "@/components/archive/ArchivePagination";
import { ArchiveSidebar } from "@/components/archive/ArchiveSidebar";
import { paginate } from "@/lib/pagination";
import {
  filterNewsByCategory,
  getNewsCategories,
  getNewsPosts,
  NEWS_PER_PAGE,
  type NewsCategory,
} from "@/lib/queries/news";
import { NEWS_EYEBROW, NEWS_ROUTES, NEWS_TITLE } from "./newsConfig";

/** slugからカテゴリーを探す。WordPressに無い（記事が0件で返ってこない）slugなら undefined */
export async function findNewsCategory(
  slug: string
): Promise<NewsCategory | undefined> {
  return (await getNewsCategories()).find((category) => category.slug === slug);
}

interface NewsListPageProps {
  /** 1始まりのページ番号 */
  page: number;
  /** カテゴリー別の一覧のときだけ渡す */
  categorySlug?: string;
}

/**
 * お知らせの一覧とカテゴリー別一覧（4ルート共通）。記事の取得・カテゴリーの確認・ページ分けをここで行い、
 * ルートの側はページ番号とカテゴリーのslugを渡すだけにする（4か所に同じ手順を書かないため）。
 * Figmaでは一覧もカテゴリー別も同じ組みで、違うのはパンくずだけ
 */
export async function NewsListPage({ page, categorySlug }: NewsListPageProps) {
  const [allPosts, categories] = await Promise.all([
    getNewsPosts(),
    getNewsCategories(),
  ]);
  const currentCategory = categorySlug
    ? categories.find((category) => category.slug === categorySlug)
    : undefined;

  if (categorySlug && !currentCategory) {
    notFound();
  }

  const listPosts = currentCategory
    ? filterNewsByCategory(allPosts, currentCategory.slug)
    : allPosts;
  const { items, totalPages } = paginate(listPosts, page, NEWS_PER_PAGE);

  // 1ページ目は記事が0件でも空の一覧として出す（paginate の約束）。2ページ目以降の空は存在しないページ
  if (items.length === 0 && page > 1) {
    notFound();
  }

  const breadcrumbItems = currentCategory
    ? [
        { label: NEWS_TITLE, href: NEWS_ROUTES.list(1) },
        { label: currentCategory.name },
      ]
    : [{ label: NEWS_TITLE }];

  return (
    <ArchivePageShell
      title={NEWS_TITLE}
      eyebrow={NEWS_EYEBROW}
      breadcrumbItems={breadcrumbItems}
      sidebar={
        <ArchiveSidebar
          posts={allPosts}
          categories={categories}
          routes={NEWS_ROUTES}
          currentCategorySlug={currentCategory?.slug}
        />
      }
    >
      {/* カードとページ送りの間はSP 60px / PC 100px（Figma） */}
      <div className="flex flex-col items-center gap-[60px] lg:gap-[100px]">
        <ul className="flex w-full flex-col gap-5">
          {items.map((post) => (
            <li key={post.slug}>
              <ArchiveCard
                post={post}
                href={NEWS_ROUTES.post(post.slug)}
                variant="list"
                titleAs="h2"
              />
            </li>
          ))}
        </ul>

        <ArchivePagination
          currentPage={page}
          totalPages={totalPages}
          buildHref={(pageNumber) =>
            NEWS_ROUTES.list(pageNumber, currentCategory?.slug)
          }
        />
      </div>
    </ArchivePageShell>
  );
}
