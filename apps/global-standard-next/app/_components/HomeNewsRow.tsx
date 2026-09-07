import Link from "next/link";
import type { NewsPost } from "@/lib/queries/news";

interface HomeNewsRowProps {
  post: NewsPost;
}

/**
 * トップページのお知らせ1行。サムネイルが無いレイアウトなので、
 * 画像を必ず描く一覧の NewsListItem は使えず、この形だけを別に持つ。
 */
export function HomeNewsRow({ post }: HomeNewsRowProps) {
  return (
    <li className="border-b border-[#ddd] pt-4 pb-[31px] first:pt-0 lg:py-7 lg:first:pt-7">
      {/* 行のどこを押しても記事が開くよう、行全体をリンクにする */}
      <Link href={`/news/${post.slug}`} className="group flex flex-col gap-5">
        <div className="flex items-center justify-between gap-2">
          {post.category && (
            <span className="shrink-0 border border-accent-2 px-5 py-[6px] text-xs text-accent-2 lg:px-6 lg:py-2 lg:text-sm">
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

        {/* Figmaでは長いタイトルが1行目の末尾で「…」になる */}
        <h3 className="truncate text-sm font-bold text-contrast transition-colors duration-300 group-hover:text-main group-focus-visible:text-main motion-reduce:transition-none lg:text-base">
          {post.title}
        </h3>
      </Link>
    </li>
  );
}
