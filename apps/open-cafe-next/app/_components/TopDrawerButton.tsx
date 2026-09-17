"use client";

import { useEffect, useState } from "react";
import { DrawerMenu } from "@/components/layout/DrawerMenu";

interface TopDrawerButtonProps {
  /** 見張るファーストビューの要素のid */
  firstViewId: string;
}

/**
 * TOPのメニューボタン（Figma: 【TOP】ドロワーメニューボタン 19742:13912）。
 *
 * - xl〜（PCの組み）：ファーストビューの左に縦のナビがあるので、ボタンは最初は出さない。
 *   Figmaの指示「ファーストビューが見えなくなるところまでスクロールしたら表示」に従い、
 *   ファーストビューが画面から消えたら右上（上20px・右20px）に出す
 * - 〜xl（SP・タブレットの組み）：ファーストビューのヘッダーにボタンが描かれている（Figma: header 19710:3095）。
 *   その位置（上10px・右10px）に最初から固定し、スクロールしても残す（下層ページと同じ）
 */
export function TopDrawerButton({ firstViewId }: TopDrawerButtonProps) {
  const [isPastFirstView, setIsPastFirstView] = useState(false);

  useEffect(() => {
    const firstView = document.getElementById(firstViewId);
    if (!firstView) return;

    // スクロールのたびに位置を計算せず、見えている／いないが変わったときだけ知らせてもらう
    const observer = new IntersectionObserver(([entry]) => {
      setIsPastFirstView(!entry.isIntersecting);
    });
    observer.observe(firstView);

    return () => {
      observer.disconnect();
    };
  }, [firstViewId]);

  return (
    // z-50：ページトップへ戻る(z-40)より上にする（PageHero と同じ理由）。
    // 隠すのは開閉ボタン（外枠の直下の button）だけにする。外枠ごと透明にすると、ドロワーを開いたまま
    // 画面幅が xl を越えた（タブレットを横に回した）ときに、ドロワーと黒い面まで見えなくなり、
    // 裏のページは操作もスクロールもできないまま閉じる手段が無くなるため。
    // invisible でフォーカス順からも外す（visibility は子で上書きできるので、開いたドロワーには効かない）
    <div
      className={`fixed top-2.5 right-2.5 z-50 xl:top-5 xl:right-5 [&>button]:transition-[opacity,visibility] motion-reduce:[&>button]:transition-none ${
        isPastFirstView ? "" : "xl:[&>button]:invisible xl:[&>button]:opacity-0"
      }`}
    >
      <DrawerMenu />
    </div>
  );
}
