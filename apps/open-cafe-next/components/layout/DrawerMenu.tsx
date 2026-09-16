"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { makeOutsideDrawerInert } from "@/components/layout/drawerMenuInert";
import { SnsIcons } from "@/components/layout/SnsIcons";
import { NAV_ITEMS, SITE_NAME, isCurrentNavItem } from "@/lib/site";

const DRAWER_ID = "drawer-menu";

/** ルールセット「その他リンク」「ハンバーガー内メニュー」：ホバーで透明度70% */
const HOVER_FADE_CLASS =
  "transition-opacity duration-300 hover:opacity-70 focus-visible:opacity-70 motion-reduce:transition-none";

/**
 * メニューの開閉ボタンとドロワー（Figma: 【PC】ドロワーメニュー 19742:14510 / 【SP】19709:7335）。
 * PC・SPとも右から出る375px幅（SPは画面幅いっぱい）。開閉の動きはFigmaに無いので、
 * 「右から出る」が伝わる最小限のスライドだけ付け、動きを減らす設定では付けない
 */
export function DrawerMenu() {
  const pathname = usePathname();
  // 開閉を「開いたときのURL」で持ち、今のURLと同じ間だけ開いているとみなす。ブラウザの戻るなどで
  // ページが変わると、閉じる処理を呼ばなくても閉じる（useEffectで閉じ直すと1回余計に描画される）
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const isOpen = menuOpenedAt === pathname;
  // ページが変わったら開いたときのURLも捨てる。残すと、戻るで元のページに帰ったときにまた開いてしまう
  if (menuOpenedAt !== null && !isOpen) setMenuOpenedAt(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // 閉じた後に開閉ボタンへフォーカスを戻すか。リンクで移動したときは、移動先でフォーカスが
  // 先頭に戻るので戻さない
  const shouldReturnFocusRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    // ドロワーが画面を覆っている間、背後のページが動くと操作先を見失うため止める
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const openButton = openButtonRef.current;

    // 開閉ボタン自身も inert になるので、キーボード操作の続きを閉じるボタンから始められるようにする
    const restoreOutside = drawerRef.current
      ? makeOutsideDrawerInert(drawerRef.current)
      : undefined;
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      shouldReturnFocusRef.current = true;
      setMenuOpenedAt(null);
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      // inert を外してからでないと、開閉ボタンにフォーカスを移せない
      restoreOutside?.();
      document.removeEventListener("keydown", closeOnEscape);
      if (shouldReturnFocusRef.current) {
        shouldReturnFocusRef.current = false;
        openButton?.focus();
      }
    };
  }, [isOpen]);

  const closeAndReturnFocus = () => {
    shouldReturnFocusRef.current = true;
    setMenuOpenedAt(null);
  };

  // 今いるページのリンクを押すとURLが変わらず自然には閉じないので、押した時点で閉じる
  const closeOnNavigate = () => setMenuOpenedAt(null);

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={DRAWER_ID}
        aria-label="メニューを開く"
        onClick={() => setMenuOpenedAt(pathname)}
        className={`flex size-[60px] cursor-pointer items-center justify-center rounded-full bg-main ${HOVER_FADE_CLASS}`}
      >
        <Image
          src="/images/common/icon-menu.svg"
          alt=""
          aria-hidden="true"
          width={28}
          height={18}
          loading="lazy"
          className="h-[18px] w-7"
        />
      </button>

      {/* 閉じている間も描画したまま invisible にする（出し入れすると右へ抜ける動きが付けられないため）。
          invisible はフォーカス順からも外れる */}
      <div ref={drawerRef}>
        {/* 黒の半透明。Figmaの指示「黒の半透明部分をクリックしてもメニューを閉じる」。
            キーボードではESCで閉じられるので、この面はボタンにしない */}
        <div
          aria-hidden="true"
          onClick={closeAndReturnFocus}
          className={`fixed inset-0 z-50 bg-black/30 transition-[opacity,visibility] duration-300 motion-reduce:transition-none ${
            isOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        />

        <div
          id={DRAWER_ID}
          role="dialog"
          aria-modal="true"
          aria-label="メニュー"
          // visibility を遅らせるのは閉じるときだけ。開くときまで遅らせると、開いた直後の1フレームは
          // まだ hidden 扱いで、閉じるボタンへの focus() が効かない
          className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[375px] flex-col overflow-y-auto bg-main duration-300 motion-reduce:transition-none ${
            isOpen
              ? "visible translate-x-0 transition-[translate]"
              : "invisible translate-x-full transition-[translate,visibility]"
          }`}
        >
          <div className="flex shrink-0 items-start justify-between p-2.5">
            <Link href="/" onClick={closeOnNavigate} className={HOVER_FADE_CLASS}>
              <Image
                src="/images/common/logo-light.svg"
                alt={SITE_NAME}
                width={120}
                height={65}
                loading="lazy"
                className="h-[65px] w-[120px]"
              />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="メニューを閉じる"
              onClick={closeAndReturnFocus}
              className={`flex size-[60px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-white ${HOVER_FADE_CLASS}`}
            >
              <Image
                src="/images/common/icon-close.svg"
                alt=""
                aria-hidden="true"
                width={21}
                height={21}
                loading="lazy"
                className="size-[21px]"
              />
            </button>
          </div>

          <nav
            aria-label="メインメニュー"
            className="flex flex-1 flex-col items-center gap-[50px] px-10 py-[50px]"
          >
            <ul className="flex w-full flex-col items-start gap-[25px]">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  {/* Figmaに現在地の見た目は無いので、読み上げ用の aria-current だけ付ける */}
                  <Link
                    href={item.href}
                    aria-current={
                      isCurrentNavItem(pathname, item.href) ? "page" : undefined
                    }
                    onClick={closeOnNavigate}
                    // 行の高さは文字サイズと一緒に書く。親の leading-[1.5] は子の text-2xl 等に打ち消される
                    // （Tailwind v4 の --tw-leading は子へ引き継がれない。/rules/tailwind.md）
                    className={`flex items-center gap-3 whitespace-nowrap text-white ${HOVER_FADE_CLASS}`}
                  >
                    <span className="font-patua text-2xl/[1.5] tracking-[0.12em] uppercase">
                      {item.labelEn}
                    </span>
                    {/* 見た目の「／」は読み上げない。代わりに見えない読点を挟み、「top、トップ」と区切って読ませる
                        （無いと「topトップ」とくっつく） */}
                    <span aria-hidden="true" className="text-[10px]/[1.5]">
                      ／
                    </span>
                    <span className="sr-only">、</span>
                    <span className="text-[10px]/[1.5]">{item.labelJa}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <SnsIcons />
          </nav>
        </div>
      </div>
    </>
  );
}
