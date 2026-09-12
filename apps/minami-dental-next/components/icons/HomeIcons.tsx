import { SVG_BASE_PROPS } from "./SmallIcons";
import type { IconProps } from "./types";

// ホームだけで使うアイコン（SidebarIcons.tsx と同じく、使う場所ごとにまとめる）。
// どちらもFigmaの書き出しのパスそのまま（色だけcurrentColorに置き換え）

/**
 * お知らせの行の右矢印（Figma: news-arrow）。
 * SPメニューの ArrowRightIcon と枠は同じ14pxだが、矢じりがひと回り長い別のアイコン
 */
export function NewsArrowIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={15.4}
      height={15.4}
      viewBox="0 0 15.3999 15.4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M0.7 7.70001H14.6999" />
      <path d="M6.45098 0.700014L14.6997 7.70001L6.45098 14.7" />
    </svg>
  );
}

/**
 * メインビジュアルの左右の矢印の山形（Figma: arrow-left / arrow-right の中身）。
 * 白い丸と影はCSSで作るので、ここは山形だけ。左向きなので、右向きにはCSSで反転させる
 */
export function SliderChevronIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={14.4451}
      height={26.8901}
      viewBox="0 0 14.4451 26.8901"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
    >
      <path d="M13.4451 25.8901L1 13.4451L13.4451 1" />
    </svg>
  );
}
