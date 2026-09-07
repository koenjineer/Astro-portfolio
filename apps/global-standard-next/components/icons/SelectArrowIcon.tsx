interface SelectArrowIconProps {
  /** サイズと位置は使う側で指定する（w-[11px] など） */
  className?: string;
}

/**
 * セレクトボックス右端の下向き矢印（Figma: select-arrow）。
 * 使うのはお問い合わせページだけだが、共通部品のFormFieldが描くため
 * 他のアイコンと同じ場所に置く。塗りをcurrentColorにして親の文字色に追従させる。
 */
export function SelectArrowIcon({ className }: SelectArrowIconProps) {
  return (
    <svg
      width={14}
      height={10}
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M7.40711 8.80711L2 3.4L3.4 2L7.40711 6.00711L11.4142 2L12.8142 3.4L7.40711 8.80711Z"
        fill="currentColor"
      />
    </svg>
  );
}
