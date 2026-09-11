import type { ReactNode } from "react";

interface FormHeadingProps {
  /** 見出しの文字。SPだけ改行する所には <br className="lg:hidden" /> を入れる（例: お問い合わせフォーム） */
  children: ReactNode;
}

/** 左右に斜線の飾りが付く見出し（Figma: Heading ＋ title-deco）。WEB予約・お問い合わせのフォームの上に置く */
export function FormHeading({ children }: FormHeadingProps) {
  return (
    <h2 className="flex items-center justify-center gap-[14px] text-xl/[1.5] font-bold tracking-[0.08em] lg:gap-7 lg:text-[28px]/[1.5]">
      <TitleDeco />
      {/* span で包む：flex の直下に <br> を置いても改行にならないため。2行になった時はFigmaどおり中央揃え */}
      <span className="text-center">{children}</span>
      <TitleDeco />
    </h2>
  );
}

/** 斜線5本（Figma: title-deco。PC 67×20 / SP 49×14.6 は同じ形の拡大縮小） */
function TitleDeco() {
  return (
    <svg
      width={67}
      height={20}
      viewBox="0 0 67 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="h-[14.627px] w-[49px] shrink-0 text-main lg:h-5 lg:w-[67px]"
    >
      <path d="M11.9523 0H15.5343L3.58198 20H0L11.9523 0Z" />
      <path d="M24.9276 0H28.5095L16.5572 20H12.9752L24.9276 0Z" />
      <path d="M37.9028 0H41.4848L29.5324 20H25.9505L37.9028 0Z" />
      <path d="M50.878 0H54.46L42.5077 20H38.9257L50.878 0Z" />
      <path d="M63.418 0H67L55.0477 20H51.4657L63.418 0Z" />
    </svg>
  );
}
