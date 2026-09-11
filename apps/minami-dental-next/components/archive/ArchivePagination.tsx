import Link from "next/link";
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@/components/icons/SmallIcons";

/** 数字の枠がこれを超えたら「…」で省く（Figmaの部品置き場の pagenation-pc が数字3つ＋前後なので、少し余裕を持たせた） */
const MAX_PAGE_SLOTS = 5;

// Figma: button-number（PC 36px / SP 30px）。枠線＋白地のボタンなので、ホバーはサイト共通の「mainで塗り白文字」
const NUMBER_BOX =
  "flex size-[30px] items-center justify-center rounded-[4px] border border-main text-xs/[1.5] lg:size-9 lg:text-sm/[1.5]";
const NUMBER_LINK = `${NUMBER_BOX} text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none`;

// Figma: button-prev / button-next（PC 82×36 / SP 71×30）。main塗りのボタンなので、ホバーはサイト共通の「main-darkに濃く」
const STEP_LINK =
  "flex h-[30px] w-[71px] items-center justify-center gap-1 rounded-[4px] bg-main text-[11px]/[1.5] text-white transition-colors duration-300 hover:bg-main-dark focus-visible:bg-main-dark motion-reduce:transition-none lg:h-9 lg:w-[82px] lg:gap-2.5 lg:text-sm/[1.5]";
const STEP_ICON = "size-3.5 lg:size-4";

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

interface ArchivePaginationProps {
  currentPage: number;
  totalPages: number;
  /** ページ番号からURLを作る。全件一覧とカテゴリ別で行き先が変わるため呼び出し側から渡す */
  buildHref: (page: number) => string;
}

/** 一覧のページ送り（Figma: pagenation / pagenation-sp）。1ページしか無ければ出さない */
export function ArchivePagination({
  currentPage,
  totalPages,
  buildHref,
}: ArchivePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const slots = buildPageSlots(currentPage, totalPages);

  return (
    <nav aria-label="ページ送り" className="flex items-center gap-2.5">
      {/* 1ページ目に「前へ」、最終ページに「次へ」は出さない（Figmaの1ページ目が「1 2 次へ」のため） */}
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className={STEP_LINK}>
          <ArrowCircleLeftIcon className={STEP_ICON} />
          前へ
        </Link>
      )}

      <ul className="flex items-center gap-2.5">
        {slots.map((slot, index) =>
          slot === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="flex size-[30px] items-center justify-center text-xs/[1.5] text-main lg:size-9 lg:text-sm/[1.5]"
            >
              …
            </li>
          ) : (
            <li key={slot}>
              {slot === currentPage ? (
                <span
                  aria-current="page"
                  className={`${NUMBER_BOX} bg-main text-white`}
                >
                  {slot}
                </span>
              ) : (
                <Link
                  href={buildHref(slot)}
                  aria-label={`${slot}ページ目`}
                  className={NUMBER_LINK}
                >
                  {slot}
                </Link>
              )}
            </li>
          )
        )}
      </ul>

      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className={STEP_LINK}>
          次へ
          <ArrowCircleRightIcon className={STEP_ICON} />
        </Link>
      )}
    </nav>
  );
}
