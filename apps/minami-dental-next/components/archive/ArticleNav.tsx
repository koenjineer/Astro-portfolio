import Link from "next/link";
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@/components/icons/SmallIcons";

// Figma: pagenation-artical-pc / pagenation-article-sp。高さ36px、文字はPC 14px / SP 12px
const BUTTON_BASE =
  "flex h-9 items-center justify-center rounded-[4px] px-3.5 text-xs/[1.5] whitespace-nowrap transition-colors duration-300 motion-reduce:transition-none lg:text-sm/[1.5]";
// main塗り → ホバーで main-dark（サイト共通の塗りボタンの約束）
const FILLED_BUTTON = `${BUTTON_BASE} gap-2.5 bg-main text-white hover:bg-main-dark focus-visible:bg-main-dark`;
// 枠線＋白地 → ホバーで main 塗り・白文字（サイト共通の枠線ボタンの約束）
const OUTLINED_BUTTON = `${BUTTON_BASE} border border-main text-main hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white`;

interface ArticleNavProps {
  /** 1つ古い記事のURL。一番古い記事では渡さない */
  olderHref?: string;
  /** 1つ新しい記事のURL。一番新しい記事では渡さない */
  newerHref?: string;
  /** 「記事一覧」の行き先 */
  listHref: string;
}

/** 記事の下の「前の記事へ／記事一覧／次の記事へ」。前＝古い記事（WordPressの「前の記事」と同じ向き） */
export function ArticleNav({ olderHref, newerHref, listHref }: ArticleNavProps) {
  return (
    <nav aria-label="前後の記事" className="flex justify-center">
      {/* Figmaは3つのボタンが入る幅を中央に置き、「記事一覧」を真ん中に据えている。
          左右を同じ幅の列（1fr）にして、前後どちらかが無い記事でも「記事一覧」の位置を動かさない */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2.5">
        <div className="flex justify-end">
          {olderHref && (
            <Link href={olderHref} className={FILLED_BUTTON}>
              <ArrowCircleLeftIcon className="size-4" />
              前の記事へ
            </Link>
          )}
        </div>
        <Link href={listHref} className={OUTLINED_BUTTON}>
          記事一覧
        </Link>
        <div className="flex justify-start">
          {newerHref && (
            <Link href={newerHref} className={FILLED_BUTTON}>
              次の記事へ
              <ArrowCircleRightIcon className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
