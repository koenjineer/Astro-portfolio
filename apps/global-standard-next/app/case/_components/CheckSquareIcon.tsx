interface CheckSquareIconProps {
  /** サイズと色は使う側で指定する（size-5 text-accent-2 など） */
  className?: string;
}

/**
 * チェック済みチェックボックスのアイコン（Figma: Icon ionic-md-checkbox-outline）。
 * 1枚のカードに3つ、9社ぶんで計27回出るため、画像ファイルではなくインラインSVGにする。
 * 塗りはArrowRightIconと同じくcurrentColorにして、色はTailwindのトークン
 * （text-accent-2）で与える。globals.cssのトークン以外の色を持ち込まないため。
 */
export function CheckSquareIcon({ className }: CheckSquareIconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M5.44432 7.88901L3.88891 9.44443L8.88891 14.4444L20 3.33333L18.4446 1.77792L8.88891 11.2777L5.44432 7.88901ZM17.7778 17.7778H2.22224V2.22224H13.3333V0H2.22224C0.999896 0 0 0.999896 0 2.22224V17.7778C0 19.0001 0.999896 20 2.22224 20H17.7778C19.0001 20 20 19.0001 20 17.7778V8.88891H17.7778V17.7778Z"
        fill="currentColor"
      />
    </svg>
  );
}
