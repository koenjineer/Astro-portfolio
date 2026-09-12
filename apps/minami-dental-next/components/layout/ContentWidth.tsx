import type { ReactNode } from "react";

interface ContentWidthProps {
  children: ReactNode;
}

/**
 * 本文の幅（小さな外側の余白＋幅の上限1000pxで中央に置く）。
 * スタッフ紹介・診療案内で使う。写真の帯や波の帯のように画面の端から端まで敷くものは、この外に置く
 */
export function ContentWidth({ children }: ContentWidthProps) {
  return (
    <div className="px-5">
      <div className="mx-auto max-w-[1000px]">{children}</div>
    </div>
  );
}
