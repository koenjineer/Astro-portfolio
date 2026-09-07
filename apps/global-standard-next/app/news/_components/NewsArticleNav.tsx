import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import type { AdjacentNewsPosts } from "@/lib/queries/news";

/** Figmaのボタンは114×36。文字が長い記事名は入らないので、114pxは下限として使う */
const BUTTON =
  "flex h-9 min-w-[114px] items-center justify-center gap-1 rounded-[4px] border border-main px-3 text-sm text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none";

export function NewsArticleNav({ older, newer }: AdjacentNewsPosts) {
  if (!older && !newer) {
    return null;
  }

  return (
    // justify-between：両方あるときは左右に離れ、片方だけのときはその側に寄る。
    // mt-10：Figmaの本文とボタンの間（PC/SPとも40px）
    <nav
      aria-label="前後の記事"
      className="mt-10 flex items-center justify-between"
    >
      {older && (
        <Link href={`/news/${older.slug}`} className={BUTTON}>
          <ChevronRightIcon className="size-4 rotate-180" />
          前の記事へ
        </Link>
      )}
      {newer && (
        <Link href={`/news/${newer.slug}`} className={`${BUTTON} ml-auto`}>
          次の記事へ
          <ChevronRightIcon className="size-4" />
        </Link>
      )}
    </nav>
  );
}
