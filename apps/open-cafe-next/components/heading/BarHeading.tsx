import type { ReactNode } from "react";

interface BarHeadingProps {
  children: ReactNode;
}

/**
 * 左に縦棒が付く見出し（Figma: h2 19719:7102 / h2-sp 19719:8568）。
 *
 * 棒は6px。Figmaの線は枠の内側に描かれて文字の位置を動かさないが、CSSの border は文字を押し出すので、
 * 左の余白は棒の6pxを引いた10pxにする（文字の左端をFigmaと同じ16pxに合わせるため）
 */
export function BarHeading({ children }: BarHeadingProps) {
  return (
    <h2 className="border-l-6 border-main pl-2.5 text-lg/[1.5] font-bold text-main md:text-2xl/[1.5]">
      {children}
    </h2>
  );
}
