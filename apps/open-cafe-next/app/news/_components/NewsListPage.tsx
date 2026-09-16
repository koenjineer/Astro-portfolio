import { notFound } from "next/navigation";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsPagination } from "@/components/news/NewsPagination";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import {
  NEWS_EYEBROW,
  NEWS_HERO_IMAGE_PC_SRC,
  NEWS_HERO_IMAGE_SP_SRC,
  NEWS_TITLE,
  newsCategoryHref,
  newsListHref,
  newsPostHref,
} from "@/lib/newsRoutes";
import { paginate } from "@/lib/pagination";
import {
  getNewsCategories,
  getNewsPosts,
  NEWS_PER_PAGE,
} from "@/lib/queries/news";

/** カテゴリー別ページの `generateMetadata` からも使う（見つからなければ undefined） */
export async function findNewsCategory(slug: string) {
  return (await getNewsCategories()).find((category) => category.slug === slug);
}

interface NewsListPageProps {
  /** 1始まりのページ番号 */
  page: number;
  /** カテゴリー別の一覧のときだけ渡す */
  categorySlug?: string;
}

/**
 * お知らせ一覧とカテゴリー別一覧の組み立て（Figma: 19716:3289 / 19730:5391）。
 * Figmaでは2つの画面の組みが同じで、違うのはパンくずとカテゴリー名の見出しだけなので1つにまとめる。
 *
 * サイドバーを右に置くのは `lg`（1024px）から。`md`（768px）では本文720px＋間60px＋サイドバー320pxが
 * 入らず、カードが1枚154pxまで縮むため（`/rules/design-to-code.md`）
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
    ? allPosts.filter((post) => post.category.slug === currentCategory.slug)
    : allPosts;
  const { items, totalPages } = paginate(listPosts, page, NEWS_PER_PAGE);

  // 1ページ目は記事が0件でも空の一覧として出す（paginate の約束）。2ページ目以降の空は存在しないページ
  if (items.length === 0 && page > 1) {
    notFound();
  }

  const breadcrumbItems: BreadcrumbItem[] = currentCategory
    ? [{ label: NEWS_TITLE, href: newsListHref() }, { label: currentCategory.name }]
    : [{ label: NEWS_TITLE }];

  const buildHref = (pageNumber: number) =>
    currentCategory
      ? newsCategoryHref(currentCategory.slug, pageNumber)
      : newsListHref(pageNumber);

  return (
    <SubPageLayout
      title={NEWS_TITLE}
      eyebrow={NEWS_EYEBROW}
      imagePcSrc={NEWS_HERO_IMAGE_PC_SRC}
      imageSpSrc={NEWS_HERO_IMAGE_SP_SRC}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-[60px] lg:flex-row">
        {/* min-w-0：カードの列がサイドバーを押し出さないようにする */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-10">
          {currentCategory && (
            <h2 className="text-xl/[1.5] font-bold text-contrast md:text-2xl/[1.5]">
              {currentCategory.name}
            </h2>
          )}

          {/* カードは全幅で2列。SPもPCも列数は変わらず、間の余白だけ変わる */}
          <ul className="grid grid-cols-2 gap-x-[19px] gap-y-6 md:gap-10">
            {items.map((post, index) => (
              <li key={post.slug}>
                <NewsCard
                  post={post}
                  href={newsPostHref(post.slug)}
                  variant="grid"
                  titleAs="h2"
                  // 最初の2枚は画面を開いた時点で見えている
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </li>
            ))}
          </ul>

          <NewsPagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={buildHref}
          />
        </div>

        <div className="lg:w-80 lg:shrink-0">
          <NewsSidebar
            posts={allPosts}
            categories={categories}
            currentCategorySlug={currentCategory?.slug}
          />
        </div>
      </div>
    </SubPageLayout>
  );
}
