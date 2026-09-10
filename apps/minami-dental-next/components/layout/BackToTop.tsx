"use client";

import { useEffect, useState } from "react";

// PCで下層ページのヒーローの下端（ヘッダー80＋上の余白40＋写真340）を通り過ぎたら現れる高さ。
// ページ最上部では戻り先が無く、ボタンが本文に重なるだけになるため。
// SPのヒーロー下端は268px（60＋20＋188）なので少し遅れて出るが、戻りたくなるのはもっと下なので分けない
const SHOW_AFTER_SCROLL_PX = 460;

/**
 * 右下の「ページトップへ戻る」（Figma: button-to-top。白地・main の輪と矢印）。
 * Figmaではフッターの右下に置かれているが、長いページの途中からでも戻れるよう画面に追従させる
 * （姉妹サイトと同じ）。位置はFigmaの値：PC 右20・下40、SP 右10・下80（SP固定バー60pxの上）。
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
    // href="#" のまま：なめらかなスクロールは app/layout.tsx の motion-safe:scroll-smooth に任せ、
    // 「視差効果を減らす」設定への配慮をCSS側へ集約する
    <a
      href="#"
      aria-label="ページトップへ戻る"
      // 要素を出し入れせずクラスだけ切り替える（フェードを効かせるため）。
      // 非表示側は invisible も添えて、キーボードのフォーカス順から外す。
      // z-20：ヘッダー(z-30、SPメニューを含む)より下に潜らせ、メニューを開いている間は上に乗らないようにする。
      // ホバーはFigmaに無いので、ルールセット「枠線＋白地」のボタンに合わせて main で塗り、矢印を白にする
      className={`fixed right-2.5 bottom-20 z-20 size-[52px] rounded-full bg-white text-main transition-[opacity,visibility,background-color,color] duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none xl:right-5 xl:bottom-10 ${
        isVisible ? "opacity-100" : "invisible opacity-0"
      }`}
    >
      <svg
        width={52}
        height={52}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="1.5"
          y="1.5"
          width="49"
          height="49"
          rx="24.5"
          strokeWidth={3}
          className="stroke-main"
        />
        <path
          d="M27.0607 13.9393C26.4749 13.3536 25.5251 13.3536 24.9393 13.9393L15.3934 23.4853C14.8076 24.0711 14.8076 25.0208 15.3934 25.6066C15.9792 26.1924 16.9289 26.1924 17.5147 25.6066L26 17.1213L34.4853 25.6066C35.0711 26.1924 36.0208 26.1924 36.6066 25.6066C37.1924 25.0208 37.1924 24.0711 36.6066 23.4853L27.0607 13.9393ZM26 37L27.5 37L27.5 15L26 15L24.5 15L24.5 37L26 37Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
