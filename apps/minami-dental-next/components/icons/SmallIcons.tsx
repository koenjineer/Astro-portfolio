import type { IconProps } from "./types";

// 1つずつが数行の小さなアイコン。ファイルを分けると import が増えるだけなので1か所にまとめる。
// どれもFigmaの書き出しのパスそのまま（色だけcurrentColorに置き換え）

export const SVG_BASE_PROPS = {
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

/** 記事の投稿日の前のペン（Figma: icon-time） */
export function PenIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="currentColor"
      className={className}
    >
      <path d="M3.73514 3.79509C3.17755 3.95269 2.73412 4.37605 2.55089 4.92575L0 12.5781L0.401678 12.9798L4.50623 8.87526C4.42447 8.70409 4.37498 8.51487 4.37498 8.31253C4.37498 7.58765 4.96259 7.00003 5.68747 7.00003C6.41235 7.00003 6.99997 7.58765 6.99997 8.31253C6.99997 9.03741 6.41235 9.62502 5.68747 9.62502C5.48513 9.62502 5.29591 9.57553 5.12474 9.49377L1.02019 13.5983L1.42187 14L9.07425 11.4491C9.62395 11.2659 10.0473 10.8224 10.2049 10.2649L11.3749 6.12504L7.87496 2.62506L3.73514 3.79509ZM13.6155 2.02814L11.9719 0.38452C11.4592 -0.128173 10.6276 -0.128173 10.115 0.38452L8.56867 1.9308L12.0692 5.43133L13.6155 3.88505C14.1282 3.37236 14.1282 2.54111 13.6155 2.02814H13.6155Z" />
    </svg>
  );
}

/** ページ送り・前後の記事の「前へ」の丸矢印（Figma: Icon awesome-arrow-circle-left） */
export function ArrowCircleLeftIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M8 16C3.58064 16 0 12.4194 0 8C0 3.58064 3.58064 0 8 0C12.4194 0 16 3.58064 16 8C16 12.4194 12.4194 16 8 16ZM8.93226 11.3677L6.49677 9.03226H12.3871C12.8161 9.03226 13.1613 8.6871 13.1613 8.25806V7.74193C13.1613 7.3129 12.8161 6.96774 12.3871 6.96774H6.49677L8.93226 4.63226C9.24516 4.33226 9.25161 3.83226 8.94516 3.52581L8.59032 3.17419C8.2871 2.87097 7.79677 2.87097 7.49677 3.17419L3.21613 7.45161C2.9129 7.75484 2.9129 8.24516 3.21613 8.54516L7.49677 12.8258C7.8 13.129 8.29032 13.129 8.59032 12.8258L8.94516 12.4742C9.25161 12.1677 9.24516 11.6677 8.93226 11.3677Z" />
    </svg>
  );
}

/** ページ送り・前後の記事の「次へ」の丸矢印（Figma: Icon awesome-arrow-circle-right） */
export function ArrowCircleRightIcon({ className }: IconProps) {
  return (
    <svg
      {...SVG_BASE_PROPS}
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M8 0C12.4194 0 16 3.58064 16 8C16 12.4194 12.4194 16 8 16C3.58064 16 0 12.4194 0 8C0 3.58064 3.58064 0 8 0ZM7.06774 4.63226L9.50322 6.96774H3.6129C3.18387 6.96774 2.83871 7.3129 2.83871 7.74193V8.25806C2.83871 8.6871 3.18387 9.03226 3.6129 9.03226H9.50322L7.06774 11.3677C6.75484 11.6677 6.74839 12.1677 7.05484 12.4742L7.40968 12.8258C7.7129 13.129 8.20322 13.129 8.50322 12.8258L12.7839 8.54839C13.0871 8.24516 13.0871 7.75484 12.7839 7.45484L8.50322 3.17097C8.2 2.86774 7.70968 2.86774 7.40968 3.17097L7.05484 3.52258C6.74839 3.83226 6.75484 4.33226 7.06774 4.63226H7.06774Z" />
    </svg>
  );
}
