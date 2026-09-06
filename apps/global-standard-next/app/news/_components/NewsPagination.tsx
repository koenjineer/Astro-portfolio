import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

/** Figmaの「ページネーション指示書」が数字5枠＋前後の矢印なので、それを超えたら「…」で省く */
const MAX_PAGE_SLOTS = 5;

const BOX = "flex size-10 items-center justify-center lg:size-[50px]";
const INACTIVE_BOX = `${BOX} bg-[#f8f8f8] text-contrast-light transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none`;

type PageSlot = number | "ellipsis";

/**
 * 表示する数字を組み立てる。先頭と末尾は常に出し、間が空くところに「…」を入れる。
 * 例：全99ページの1ページ目なら 1 2 3 … 99
 */
function buildPageSlots(currentPage: number, totalPages: number): PageSlot[] {
  if (totalPages <= MAX_PAGE_SLOTS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages];
}

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  /** ページ番号からURLを作る。全件一覧とカテゴリ別で行き先が変わるため呼び出し側から渡す */
  buildHref: (page: number) => string;
}

export function NewsPagination({
  currentPage,
  totalPages,
  buildHref,
}: NewsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const slots = buildPageSlots(currentPage, totalPages);

  return (
    <nav
      aria-label="ページ送り"
      className="flex items-center justify-center gap-[6px] lg:gap-[30px]"
    >
      {/* 1ページ目に「前へ」、最終ページに「次へ」は出さない（Figmaの実画面が「1 2 ＞」のため） */}
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          aria-label="前のページ"
          className={INACTIVE_BOX}
        >
          <ChevronRightIcon className="size-5 rotate-180" />
        </Link>
      )}

      <ul className="flex items-center gap-[6px] lg:gap-2">
        {slots.map((slot, index) =>
          slot === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className={`${BOX} bg-[#f8f8f8] text-contrast-light`}
            >
              …
            </li>
          ) : (
            <li key={slot}>
              {slot === currentPage ? (
                <span
                  aria-current="page"
                  className={`${BOX} bg-main text-white`}
                >
                  {slot}
                </span>
              ) : (
                <Link
                  href={buildHref(slot)}
                  aria-label={`${slot}ページ目`}
                  className={INACTIVE_BOX}
                >
                  {slot}
                </Link>
              )}
            </li>
          )
        )}
      </ul>

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          aria-label="次のページ"
          className={INACTIVE_BOX}
        >
          <ChevronRightIcon className="size-5" />
        </Link>
      )}
    </nav>
  );
}
