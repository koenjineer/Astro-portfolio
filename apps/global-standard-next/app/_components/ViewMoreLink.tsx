import Link from "next/link";

interface ViewMoreLinkProps {
  href: string;
  /**
   * dark: 白背景の上（紺文字・黄色の塗り丸）／white: 写真の上（白文字・黄色の輪郭丸）。
   * Figmaの btn-more-dark-pc / btn-more-white-pc に対応する。
   */
  variant: "dark" | "white";
  /** 「View more」だけではどこへ飛ぶか分からないので、読み上げにだけ足す補足 */
  label: string;
  className?: string;
}

const VARIANT_CLASSES = {
  dark: { text: "text-main", circle: "bg-accent-1", line: "bg-main" },
  white: {
    text: "text-white",
    circle: "border-2 border-accent-1 lg:border-[3px]",
    line: "bg-white",
  },
} as const;

// 線と矢先の縦位置・右端。Figmaでは線が丸の中心より5px下を通る
const LINE_POSITION = "top-6 right-5 lg:top-[29px] lg:right-[25.5px]";

// ルールセット「矢印が右に伸びる」：線の右端が丸を突き抜けて外へ出る
// （SPは丸の右端から16px、PCは同じ比率で20px）
const LINE_HOVER_POSITION =
  "group-hover:-right-4 group-focus-visible:-right-4 lg:group-hover:-right-5 lg:group-focus-visible:-right-5";

const LINE_TRANSITION =
  "transition-[right] duration-300 motion-reduce:transition-none";

export function ViewMoreLink({
  href,
  variant,
  label,
  className = "",
}: ViewMoreLinkProps) {
  const styles = VARIANT_CLASSES[variant];

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-[13px] lg:gap-[19px] ${styles.text} ${className}`}
    >
      <span className="font-fira-sans text-xl italic lg:text-[32px]">
        View more
      </span>
      <span className="sr-only">（{label}）</span>

      {/* 丸と線を別々の要素で描く。1枚のSVGでは線だけを伸ばせないため */}
      <span
        aria-hidden="true"
        className="relative block h-10 w-[84px] lg:h-[51px] lg:w-[121px]"
      >
        <span
          className={`absolute top-0 right-0 aspect-square h-full rounded-full ${styles.circle}`}
        />
        <span
          className={`absolute left-0 h-0.5 ${styles.line} ${LINE_POSITION} ${LINE_HOVER_POSITION} ${LINE_TRANSITION}`}
        />
        {/* 矢先。線の右端を軸に、左上へ跳ね上げた1本の棒。
            FigmaのSVGは M0 31.5 H95 L81.9367 21.5 で、先端(95,31.5)から
            左上(81.9,21.5)へ戻る＝長さ16.4px・上へ37.4度 */}
        <span
          className={`absolute h-0.5 w-[16.4px] origin-right rotate-[37.4deg] ${styles.line} ${LINE_POSITION} ${LINE_HOVER_POSITION} ${LINE_TRANSITION}`}
        />
      </span>
    </Link>
  );
}
