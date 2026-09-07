"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// 下層ページのヒーロー（PageHeroの高さ250px）を通り過ぎた辺りで現れる高さ。
// ページ最上部では戻り先が無く、ボタンが本文に重なるだけになるため
const SHOW_AFTER_SCROLL_PX = 300;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const syncVisibility = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    };

    // リロード時にブラウザがスクロール位置を復元することがあるため、
    // scrollイベントを待たずマウント時にも判定しておく
    syncVisibility();

    // passive: このハンドラはpreventDefaultしないので、スクロールを待たせない
    window.addEventListener("scroll", syncVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncVisibility);
    };
  }, []);

  return (
    // href="#" のまま：なめらかなスクロールは app/layout.tsx の
    // motion-safe:scroll-smooth に任せ、「視差効果を減らす」設定への配慮をCSS側へ集約する
    <a
      href="#"
      aria-label="ページトップへ戻る"
      // 要素を出し入れせずクラスだけ切り替える（フェードを効かせるため）。
      // 非表示側は invisible も添えて、キーボードのフォーカス順から外す。
      // z-30：SPメニューのオーバーレイ(z-40)・ヘッダー(z-50)より下に潜らせ、
      // メニューを開いている間はボタンが上に乗らないようにする。
      // rounded-full bg-main：アイコンのSVGは輪と矢印が白一色で、フッター（暗い背景）専用に
      // 作られている。追従して本文の白地や写真の上に乗るようになったため、紺の丸を敷いて
      // どの背景でも見えるようにする。ホバーはルールセット「背景塗りつぶし」に合わせる
      className={`fixed right-4 bottom-4 z-30 size-10 rounded-full bg-main transition-[opacity,background-color] duration-300 hover:bg-main-dark focus-visible:bg-main-dark motion-reduce:transition-none lg:right-5 lg:bottom-5 ${
        isVisible ? "opacity-100" : "invisible opacity-0"
      }`}
    >
      <Image
        src="/images/common/icon-top-pc.svg"
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        loading="lazy"
      />
    </a>
  );
}
