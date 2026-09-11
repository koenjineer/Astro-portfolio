import { notFound } from "next/navigation";
import { filterByCategory, paginate } from "@/lib/pagination";
import { ArchiveCard } from "./ArchiveCard";
import { ArchivePageShell } from "./ArchivePageShell";
import { ArchivePagination } from "./ArchivePagination";
import { ArchiveSidebar } from "./ArchiveSidebar";
import type { ArchiveCategory, ArchivePost, ArchiveRoutes } from "./types";

interface ArchiveListPageProps {
  /** 1始まりのページ番号 */
  page: number;
  /** カテゴリー別の一覧のときだけ渡す */
  categorySlug?: string;
  /** 新しい順の全記事。一覧はここから絞り込み・ページ分けし、サイドバーの新着にもそのまま使う */
  allPosts: ArchivePost[];
  categories: ArchiveCategory[];
  routes: ArchiveRoutes;
  /** ページ上部の日本語の見出し。パンくずの「一覧」の文字にも使う */
  title: string;
  eyebrow: string;
  /** 1ページの件数。Figmaのカンプで決まるので使う側から渡す */
  perPage: number;
}

/**
 * お知らせ・ブログの一覧とカテゴリー別一覧で共通の組み立て。カテゴリーの確認・ページ分け・パンくずを
 * ここで行い、各セクションは記事の取得だけを受け持つ（どちらも同じ手順になるため）。
 * Figmaでは一覧もカテゴリー別も同じ組みで、違うのはパンくずだけ
 */
export function ArchiveListPage({
  page,
  categorySlug,
  allPosts,
  categories,
  routes,
  title,
  eyebrow,
  perPage,
}: ArchiveListPageProps) {
  const currentCategory = categorySlug
    ? categories.find((category) => category.slug === categorySlug)
    : undefined;

  if (categorySlug && !currentCategory) {
    notFound();
  }

  const listPosts = currentCategory
    ? filterByCategory(allPosts, currentCategory.slug)
    : allPosts;
  const { items, totalPages } = paginate(listPosts, page, perPage);

  // 1ページ目は記事が0件でも空の一覧として出す（paginate の約束）。2ページ目以降の空は存在しないページ
  if (items.length === 0 && page > 1) {
    notFound();
  }

  const breadcrumbItems = currentCategory
    ? [{ label: title, href: routes.list(1) }, { label: currentCategory.name }]
    : [{ label: title }];

  return (
    <ArchivePageShell
      title={title}
      eyebrow={eyebrow}
      breadcrumbItems={breadcrumbItems}
      sidebar={
        <ArchiveSidebar
          posts={allPosts}
          categories={categories}
          routes={routes}
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
                href={routes.post(post.slug)}
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
            routes.list(pageNumber, currentCategory?.slug)
          }
        />
      </div>
    </ArchivePageShell>
  );
}
