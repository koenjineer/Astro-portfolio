import Image from "next/image";
import Link from "next/link";
import type { NewsPost } from "@/lib/queries/news";

/**
 * 一覧本体とサイドバーの「新着情報」で、SPは同じ行（サムネ120×90）だがPCの寸法だけが変わる。
 * next/imageに渡す寸法は、そのバリアントで一番大きく表示されるサイズに合わせる。
 */
const VARIANTS = {
  main: {
    imageWidth: 250,
    imageHeight: 156,
    row: "gap-3 lg:gap-5",
    thumbnail: "h-[90px] w-[120px] lg:h-[156px] lg:w-[250px]",
    body: "gap-[6px] lg:gap-[15px]",
    title: "text-sm lg:text-base",
  },
  sidebar: {
    imageWidth: 120,
    imageHeight: 90,
    row: "gap-[10px]",
    thumbnail: "h-[90px] w-[120px] lg:size-[100px]",
    body: "gap-[6px] lg:gap-[10px]",
    title: "text-sm",
  },
} as const;

interface NewsListItemProps {
  post: NewsPost;
  variant?: keyof typeof VARIANTS;
}

export function NewsListItem({ post, variant = "main" }: NewsListItemProps) {
  const styles = VARIANTS[variant];

  return (
    // 高さはFigmaどおり固定せず、行内の要素で決める。タイトルを3行で打ち切るため
    // 結果的にFigmaと同じ高さ（SP90px / PC156px）に収まる
    <article>
      {/* 行のどこを押しても記事が開くよう、カード全体をリンクにする */}
      <Link
        href={`/news/${post.slug}`}
        className={`group flex items-start ${styles.row}`}
      >
        {/* タイトルがすぐ隣にあり、サムネイル自体は情報を足さないのでaltは空にする */}
        <Image
          src={post.thumbnailSrc}
          alt=""
          width={styles.imageWidth}
          height={styles.imageHeight}
          loading="lazy"
          className={`shrink-0 object-cover ${styles.thumbnail}`}
        />

        <div className={`flex min-w-0 flex-1 flex-col ${styles.body}`}>
          <div className="flex items-center justify-between gap-2">
            {post.category && (
              <span className="shrink-0 border border-accent-2 px-[10px] py-[4.5px] text-xs text-accent-2 lg:py-[5px] lg:text-sm">
                {post.category.name}
              </span>
            )}
            {/* ml-auto：カテゴリ未設定の記事でも日付を右端に置く */}
            <time
              dateTime={post.isoDate}
              className="ml-auto shrink-0 text-sm text-contrast-light"
            >
              {post.displayDate}
            </time>
          </div>

          {/* Figmaでは長いタイトルが3行目の末尾で「…」になる */}
          <h3
            className={`line-clamp-3 font-bold text-contrast transition-colors duration-300 group-hover:text-main group-focus-visible:text-main motion-reduce:transition-none ${styles.title}`}
          >
            {post.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}
