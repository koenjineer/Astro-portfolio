import Link from "next/link";
import { ChevronRightIcon } from "./ChevronRightIcon";

// Figma: page-number / page-prev / page-next（40px の丸、枠線1px、文字16px）
const CIRCLE =
  "flex size-10 items-center justify-center rounded-full border border-main text-base/[1.5]";
// Figmaにホバーの指定は無い。白地のボタンなので、現在地と同じ「mainで塗って白文字」にする
const CIRCLE_LINK = `${CIRCLE} bg-white text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none`;

interface NewsPaginationProps {
  /** 1始まり */
  currentPage: number;
  totalPages: number;
  /** ページ番号からURLを作る。全件の一覧とカテゴリー別で行き先が変わるので呼び出し側から渡す */
  buildHref: (page: number) => string;
}

/**
 * 一覧のページ送り（Figma: pagenation 19716:3747）。
 * ページが1つしかなければ何も出さない（カテゴリー別一覧は今のデータだとこちら）
 */
export function NewsPagination({
  currentPage,
  totalPages,
  buildHref,
}: NewsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    // カードとの間はSP 40px / PC 60px。親の列の間隔（24 / 40px）に足りない分をここで足す。
    // 1ページのときは何も描かないので、この余白も付かない
    <nav aria-label="ページ送り" className="mt-4 flex justify-center md:mt-5">
      <ul className="flex flex-wrap items-center justify-center gap-3">
        {/* Figmaの1ページ目は「前へ」が隠してある。最終ページの「次へ」も同じ考えで出さない */}
        {currentPage > 1 && (
          <li>
            <Link
              href={buildHref(currentPage - 1)}
              aria-label="前のページ"
              className={CIRCLE_LINK}
            >
              <ChevronRightIcon className="rotate-180" />
            </Link>
          </li>
        )}

        {pages.map((page) =>
          page === currentPage ? (
            <li key={page}>
              <span aria-current="page" className={`${CIRCLE} bg-main text-white`}>
                {page}
              </span>
            </li>
          ) : (
            <li key={page}>
              <Link
                href={buildHref(page)}
                aria-label={`${page}ページ目`}
                className={CIRCLE_LINK}
              >
                {page}
              </Link>
            </li>
          )
        )}

        {currentPage < totalPages && (
          <li>
            <Link
              href={buildHref(currentPage + 1)}
              aria-label="次のページ"
              className={CIRCLE_LINK}
            >
              <ChevronRightIcon />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
