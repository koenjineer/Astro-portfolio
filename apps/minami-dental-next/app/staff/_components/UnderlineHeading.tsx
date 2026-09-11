import type { ReactNode } from "react";

interface UnderlineHeadingProps {
  /** 見出しの文字（例: 歯科衛生士・経歴） */
  children: ReactNode;
}

/**
 * 下線付きの小見出し（Figma: heading-underline）。院長の経歴・資格と、スタッフの職種名に使う。
 * 今はスタッフ紹介だけで使うのでここに置く。2ページ目で使うときに components/heading/ へ移す
 */
export function UnderlineHeading({ children }: UnderlineHeadingProps) {
  return (
    <h3 className="border-b border-contrast pb-1.5 text-base/[1.5] font-medium">
      {children}
    </h3>
  );
}
