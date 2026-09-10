import type { IconProps } from "./types";

/**
 * 封筒（Figma: icon-contact）。お問い合わせボタンのホバーで白抜きに反転するためcurrentColorにする。
 * non-scaling-stroke：Figmaは PC(22px) と SP(16px) のどちらも線の太さが2px。
 * 1つの絵を縮めると線まで細くなるので、線幅だけは拡大縮小させない
 */
export function MailIcon({ className }: IconProps) {
  return (
    <svg
      width={22}
      height={18}
      viewBox="0 0 22.0001 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        vectorEffect="non-scaling-stroke"
        d="M3.00006 1H19.0001C20.1001 1 21.0001 1.9 21.0001 3V15C21.0001 16.1 20.1001 17 19.0001 17H3.00006C1.90006 17 1.00006 16.1 1.00006 15V3C1.00006 1.9 1.90006 1 3.00006 1Z"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M21.0001 3.13623L11.0001 10.6127L1.00006 3.13623"
      />
    </svg>
  );
}
