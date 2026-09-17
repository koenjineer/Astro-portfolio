import { Fragment, type ReactNode } from "react";
import type { ConceptText } from "../content";

interface ConceptSectionProps {
  text: ConceptText;
  /** 写真の組み（段ごとに形が違うので使う側で組む） */
  photos: ReactNode;
  /** PCで写真を左右どちらに置くか。SP・タブレットは常に文章→写真の順 */
  photosSide: "left" | "right";
}

/** 行の配列を <br /> でつなぐ（Figmaの改行位置を保つため） */
function joinLines(lines: string[]) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

/**
 * 文章＋写真の1段（Figma: section1〜3）。
 * 読み上げ順を文章→写真にそろえるため、DOMは常に文章が先。PCで写真を左に置く段は row-reverse で入れ替える。
 * PCは文章389px固定＋間70px＋写真640px。中身が1100pxに届かない1024〜1139pxでは、足りない分だけ写真側が縮む（min-w-0）
 */
export function ConceptSection({ text, photos, photosSide }: ConceptSectionProps) {
  // row-reverse では justify-end が左寄せになる（Figmaは写真が左端0、文章が710から）
  const pcDirection =
    photosSide === "left" ? "lg:flex-row-reverse lg:justify-end" : "lg:flex-row";

  return (
    <section
      aria-labelledby={text.headingId}
      className={`flex flex-col gap-8 lg:items-center lg:gap-[70px] ${pcDirection}`}
    >
      {/* 写真側のベージュの四角（absolute）は後に書かれるので文章の上に塗られる。
          1024〜1139pxでは写真が縮み、段1の四角が本文の最終行の高さまで上がるため、文章を前に出しておく */}
      <div className="relative z-10 flex flex-col gap-8 lg:w-[389px] lg:shrink-0 lg:gap-[34px]">
        <h2 id={text.headingId} className="text-xl/[2] font-bold lg:text-[28px]/[2]">
          {joinLines(text.headingLines)}
        </h2>
        <p className="text-sm/[2]">{joinLines(text.bodyLines)}</p>
      </div>

      <div className="min-w-0 lg:w-[640px]">{photos}</div>
    </section>
  );
}
