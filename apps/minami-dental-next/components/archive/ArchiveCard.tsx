import Image from "next/image";
import Link from "next/link";
import { CategoryTag } from "./CategoryTag";
import type { ArchivePost } from "./types";

/**
 * 一覧とサイドバーの「新着記事」で、SPは同じカード（Figma: blog-card-sp 335×101、サムネイル133×101）だが
 * PCの寸法だけが違う。next/image に渡す寸法は、そのバリアントで一番大きく表示されるサイズに合わせる。
 */
const VARIANTS = {
  /** 一覧（Figma: archive-blog-card-pc 670×153、サムネイル264×153） */
  list: {
    imageWidth: 264,
    imageHeight: 153,
    row: "gap-2.5 lg:gap-5",
    thumbnail: "h-[101px] w-[133px] lg:h-[153px] lg:w-[264px]",
    body: "gap-1.5 lg:gap-3.5",
    title: "text-sm/[1.5] lg:text-base/[1.5]",
    tagSize: "card",
  },
  /** サイドバーの新着記事（Figma: sidebar-blog-card-pc 300×90、サムネイル120×90） */
  sidebar: {
    imageWidth: 133,
    imageHeight: 101,
    row: "gap-2.5",
    thumbnail: "h-[101px] w-[133px] lg:h-[90px] lg:w-[120px]",
    body: "gap-1.5",
    title: "text-sm/[1.5]",
    tagSize: "sidebar",
  },
} as const;

interface ArchiveCardProps {
  post: ArchivePost;
  /** 記事のURL。お知らせとブログで行き先が違うので使う側で作って渡す */
  href: string;
  variant: keyof typeof VARIANTS;
  /** 一覧ではページのh1（ページ上部）の下なのでh2、サイドバーでは見出し「新着記事」（h2）の下なのでh3 */
  titleAs: "h2" | "h3";
}

/** 記事のカード。ホバーで文字がmainに、サムネイルが少し拡大（docs/design-rules.md のホバー表） */
export function ArchiveCard({
  post,
  href,
  variant,
  titleAs: TitleTag,
}: ArchiveCardProps) {
  const styles = VARIANTS[variant];

  return (
    <article>
      {/* カードのどこを押しても記事が開くよう、カード全体をリンクにする */}
      <Link href={href} className={`group flex items-center ${styles.row}`}>
        {/* 拡大したサムネイルが枠からはみ出さないよう、外側で切り抜く */}
        <div className={`shrink-0 overflow-hidden ${styles.thumbnail}`}>
          {/* タイトルがすぐ隣にあり、サムネイル自体は情報を足さないのでaltは空にする */}
          <Image
            src={post.thumbnailSrc}
            alt=""
            width={styles.imageWidth}
            height={styles.imageHeight}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
          />
        </div>

        <div className={`flex min-w-0 flex-1 flex-col items-start ${styles.body}`}>
          {post.category && (
            <CategoryTag name={post.category.name} size={styles.tagSize} />
          )}
          {/* Figmaはタイトル欄が2行分の高さで固定され、あふれた分は「…」。
              短いタイトルでも日付の位置が揃うよう、2行分（1.5×2＝3em）の高さを確保する */}
          <TitleTag
            className={`line-clamp-2 min-h-[3em] w-full transition-colors duration-300 group-hover:text-main group-focus-visible:text-main motion-reduce:transition-none ${styles.title}`}
          >
            {post.title}
          </TitleTag>
          <time
            dateTime={post.isoDate}
            className="text-[11px]/[1.5] text-contrast-light"
          >
            {post.displayDate}
          </time>
        </div>
      </Link>
    </article>
  );
}
