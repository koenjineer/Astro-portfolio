import type { IconProps } from "./types";

// 1つずつが数行の小さなアイコン。ファイルを分けると import が増えるだけなので1か所にまとめる。
// どれもFigmaの書き出しのパスそのまま（色だけcurrentColorに置き換え）

const SVG_BASE_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  focusable: false,
} as const;

/** SPメニューの右矢印（Figma: icon-right）。14px枠から5%はみ出して描かれる */
export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={15.4}
      height={15.4}
      viewBox="0 0 15.4001 15.4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M0.7 7.7H14.7" />
      <path d="M8.09453 0.700002L14.7001 7.7L8.09453 14.7" />
    </svg>
  );
}

/** フッターのサイトマップ小項目の三角（Figma: icon） */
export function TriangleRightIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={6}
      height={12}
      viewBox="0 0 6 12"
      fill="currentColor"
      className={className}
    >
      <path d="M0 0L6 6L0 12V0Z" />
    </svg>
  );
}

/** セレクトの下向き矢印（Figma: feather/chevron-down） */
export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={11.6667}
      height={6.66667}
      viewBox="0 0 11.6667 6.66667"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.66667}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M0.833333 0.833333L5.83333 5.83333L10.8333 0.833333" />
    </svg>
  );
}

/** チェックボックスのチェック（Figma: check-icon） */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.64795 8.20751L7.14454 12.7041L15.352 4.49658" />
    </svg>
  );
}

/** SPヘッダーの開くボタン（Figma: icon-menu） */
export function MenuIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
    >
      <path d="M28.875 10H4.125C3.50625 10 3 9.55 3 9V9C3 8.45 3.50625 8 4.125 8H28.875C29.4937 8 30 8.45 30 9V9C30 9.55 29.4937 10 28.875 10Z" />
      <path d="M28.875 17H4.125C3.50625 17 3 16.55 3 16V16C3 15.45 3.50625 15 4.125 15H28.875C29.4937 15 30 15.45 30 16V16C30 16.55 29.4937 17 28.875 17Z" />
      <path d="M28.875 24H4.125C3.50625 24 3 23.55 3 23V23C3 22.45 3.50625 22 4.125 22H28.875C29.4937 22 30 22.45 30 23V23C30 23.55 29.4937 24 28.875 24Z" />
    </svg>
  );
}

/** SPメニューの閉じるボタン（Figma: グループ 10998） */
export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
    >
      <path d="M23.8167 25.8874L6.31583 8.38649C5.87831 7.94896 5.87831 7.23302 6.31583 6.7955V6.7955C6.75336 6.35797 7.4693 6.35797 7.90682 6.7955L25.4077 24.2964C25.8452 24.7339 25.8452 25.4499 25.4077 25.8874V25.8874C24.9702 26.3249 24.2542 26.3249 23.8167 25.8874Z" />
      <path d="M25.4079 8.38649L7.90699 25.8874C7.46947 26.3249 6.75353 26.3249 6.316 25.8874V25.8874C5.87848 25.4499 5.87848 24.7339 6.316 24.2964L23.8169 6.7955C24.2544 6.35797 24.9704 6.35797 25.4079 6.7955V6.7955C25.8454 7.23302 25.8454 7.94896 25.4079 8.38649Z" />
    </svg>
  );
}
