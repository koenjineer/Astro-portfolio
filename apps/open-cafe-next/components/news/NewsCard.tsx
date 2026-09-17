import Image from "next/image";
import Link from "next/link";
import type { NewsPost } from "@/lib/queries/news";
import { CategoryBadge } from "./CategoryBadge";
import { NEWS_IMAGE_HEIGHT, NEWS_IMAGE_WIDTH } from "./newsImage";

// ルールセット「その他リンク」のホバー（透明度70%）。パンくずと同じ約束にそろえる
const HOVER =
  "transition-opacity duration-300 hover:opacity-70 focus-visible:opacity-70 motion-reduce:transition-none";

/** サイドバーの写真は100px四方（Figma: news-sidebar 19709:5714） */
const SIDEBAR_IMAGE_SIZE = "size-[100px]";

const IMAGE_CLASS_NAMES: Record<NewsCardProps["variant"], string> = {
  grid: "aspect-[340/213] w-full object-cover",
  sidebar: `${SIDEBAR_IMAGE_SIZE} shrink-0 object-cover`,
  large: "aspect-[335/210] w-full object-cover md:aspect-[510/319]",
};

const DATE_CLASS_NAMES: Record<NewsCardProps["variant"], string> = {
  grid: "text-xs/[1.5] md:text-sm/[1.5]",
  sidebar: "text-xs/[1.5]",
  large: "text-sm/[1.5]",
};

interface NewsCardProps {
  post: NewsPost;
  href: string;
  /**
   * `grid`：一覧と関連記事の縦組み（写真の上にカテゴリーのリボン）。
   * `sidebar`：サイドバー「最近の投稿」の横組み（リボンなし）。
   * `large`：TOPのお知らせの大きいカード（写真・記事名が大きく、本文の冒頭が付く）
   */
  variant: "grid" | "sidebar" | "large";
  /** 見出しの深さ。一覧ではh2、サイドバーと関連記事ではその節の見出しの下なのでh3 */
  titleAs: "h2" | "h3";
  /** 画面のいちばん上に出るカードだけ先に読み込む */
  loading?: "eager" | "lazy";
}

/**
 * お知らせのカード（Figma: card-news-pc 19709:6032 / card-news-sp 19716:3863 / news-sidebar /
 * card-news-large-pc 19709:8796 / card-news-large-sp 19710:3939）。
 * 写真はどこでも同じ1枚を切り抜いて使うので、縦横比は枠の側で決める
 */
export function NewsCard({
  post,
  href,
  variant,
  titleAs: TitleTag,
  loading = "lazy",
}: NewsCardProps) {
  // WPから来る写真は飾り扱い（/rules/headless-wordpress.md）。記事名は隣の見出しが伝える
  const image = (
    <Image
      src={post.thumbnailSrc}
      alt=""
      width={NEWS_IMAGE_WIDTH}
      height={NEWS_IMAGE_HEIGHT}
      loading={loading}
      className={IMAGE_CLASS_NAMES[variant]}
    />
  );

  const date = (
    <p className={DATE_CLASS_NAMES[variant]}>
      <time dateTime={post.isoDate}>{post.displayDate}</time>
    </p>
  );

  if (variant === "large") {
    return (
      <Link href={href} className={`flex flex-col gap-4 ${HOVER}`}>
        <div className="relative">
          {image}
          <CategoryBadge name={post.category.name} size="large" />
        </div>
        <div className="flex flex-col gap-5 text-contrast">
          {/* Figmaでは記事名は1〜2行、本文の冒頭は3行で「…」 */}
          <TitleTag className="line-clamp-2 text-sm/[1.5] font-bold md:text-xl/[1.5]">
            {post.title}
          </TitleTag>
          <p className="line-clamp-3 text-xs/[1.5] md:text-sm/[1.5]">{post.excerpt}</p>
          {date}
        </div>
      </Link>
    );
  }

  if (variant === "sidebar") {
    return (
      <Link href={href} className={`flex items-center gap-3.5 ${HOVER}`}>
        {image}
        {/* min-w-0：長い記事名が縮まずに枠から飛び出すのを防ぐ */}
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 text-contrast">
          <TitleTag className="line-clamp-3 text-sm/[1.5] font-bold">
            {post.title}
          </TitleTag>
          {date}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={`flex flex-col gap-2 md:gap-3 ${HOVER}`}>
      {/* リボンの位置の基準。リボンは写真の左端から8pxはみ出すので、切り落とさない */}
      <div className="relative">
        {image}
        <CategoryBadge name={post.category.name} />
      </div>
      <div className="flex flex-col gap-3 text-contrast">
        {/* Figmaのカードは記事名が3行で「…」になる（カードの高さが1行ごとに増える） */}
        <TitleTag className="line-clamp-3 text-xs/[1.5] font-bold md:text-base/[1.5]">
          {post.title}
        </TitleTag>
        {date}
      </div>
    </Link>
  );
}
