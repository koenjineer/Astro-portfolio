"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// 下層ページ上部の写真（PC 320px）を通り過ぎたら現れる高さ。ページ最上部では戻り先が無く、
// ボタンが本文に重なるだけになるため。SPの写真は120pxだが、戻りたくなるのはもっと下なので分けない
const SHOW_AFTER_SCROLL_PX = 320;

/**
 * 右下の「ページトップへ戻る」（Figma: to-top）。
 * Figmaではフッターの右下に置かれているが、長いページの途中からでも戻れるよう画面に追従させる
 * （姉妹サイトと同じ）。位置はFigmaの値：PC 右20・下20、SP 右10・下10。
 * ホバーはFigmaに無いので、ルールセット「その他リンク」の透明度70%に合わせる
 */
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
    // href="#" のまま：なめらかなスクロールは app/layout.tsx の motion-safe:scroll-smooth に任せる。
    // 出し入れせずクラスだけ切り替える（フェードを効かせるため）。非表示側は invisible でフォーカス順から外す。
    // z-40：ドロワー(z-50)より下に潜らせる
    <a
      href="#"
      aria-label="ページトップへ戻る"
      className={`group fixed right-2.5 bottom-2.5 z-40 size-11 transition-[opacity,visibility] duration-300 motion-reduce:transition-none md:right-5 md:bottom-5 ${
        isVisible ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* 表示の切り替えも透明度で行うので、ホバーの薄さは中の画像に付けて打ち消し合わないようにする */}
      <Image
        src="/images/common/to-top.svg"
        alt=""
        aria-hidden="true"
        width={44}
        height={44}
        loading="lazy"
        className="size-11 transition-opacity duration-300 group-hover:opacity-70 group-focus-visible:opacity-70 motion-reduce:transition-none"
      />
    </a>
  );
}
