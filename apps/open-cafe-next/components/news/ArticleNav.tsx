import Link from "next/link";
import { ChevronRightIcon } from "./ChevronRightIcon";

// Figma: pagenation 19719:5140（前後のリンクは文字SP 14px / PC 16px、gap 10px）
const STEP_LINK =
  "flex items-center gap-2.5 text-sm/[1.5] font-bold whitespace-nowrap text-main transition-opacity duration-300 hover:opacity-70 focus-visible:opacity-70 motion-reduce:transition-none md:text-base/[1.5]";
// 「記事一覧」は枠線のボタン（Figmaは136×47）。左右のpaddingはFigmaの36pxから枠線の1pxを引く
const LIST_LINK =
  "flex h-[47px] items-center justify-center border border-main px-[35px] text-sm/[1.5] font-bold whitespace-nowrap text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none md:text-base/[1.5]";

interface ArticleNavProps {
  /** 1つ古い記事のURL。いちばん古い記事では渡さない */
  olderHref?: string;
  /** 1つ新しい記事のURL。いちばん新しい記事では渡さない */
  newerHref?: string;
  /** 「記事一覧」の行き先 */
  listHref: string;
}

/**
 * 記事の下の「前の記事／記事一覧／次の記事」。前＝古い記事（Figmaのいちばん新しい記事で「次の記事」が隠してある）。
 *
 * 左右を同じ幅の列（1fr）にして、前後どちらかが無い記事でも「記事一覧」が真ん中から動かないようにする
 */
export function ArticleNav({ olderHref, newerHref, listHref }: ArticleNavProps) {
  return (
    <nav
      aria-label="前後の記事"
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5"
    >
      <div className="flex justify-start">
        {olderHref && (
          <Link href={olderHref} className={STEP_LINK}>
            <ChevronRightIcon className="shrink-0 rotate-180" />
            前の記事
          </Link>
        )}
      </div>

      <Link href={listHref} className={LIST_LINK}>
        記事一覧
      </Link>

      <div className="flex justify-end">
        {newerHref && (
          <Link href={newerHref} className={STEP_LINK}>
            次の記事
            <ChevronRightIcon className="shrink-0" />
          </Link>
        )}
      </div>
    </nav>
  );
}
