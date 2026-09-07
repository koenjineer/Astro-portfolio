interface SectionHeadingProps {
  /** 英字の大見出し（Fira Sans Medium Italic） */
  english: string;
  japanese: string;
  /** 導入事例だけ紺の写真の上に乗るため白抜きにする */
  tone?: "main" | "white";
  /** セクションの aria-labelledby から参照するためのid */
  id?: string;
  className?: string;
}

const TONE_CLASSES = {
  main: "text-main",
  white: "text-white",
} as const;

/**
 * トップページ5セクション共通の見出し（Figma: hgroup-pc / hgroup-sp）。
 * 英字の行送り1.15は、Figmaの「normal」がFira Sansに当てている高さ（PC115px /
 * SP60px）に合わせた指定。ブラウザ既定の行送りだと見出しが33px背高くなる。
 */
export function SectionHeading({
  english,
  japanese,
  tone = "main",
  id,
  className = "",
}: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className={`flex flex-col items-start ${TONE_CLASSES[tone]} ${className}`}
    >
      <span className="font-fira-sans text-[52px] leading-[1.15] italic lg:text-[100px]">
        {english}
      </span>
      <span className="text-base font-bold lg:text-2xl">{japanese}</span>
    </h2>
  );
}
