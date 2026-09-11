"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavIcon } from "@/components/icons/NavIcon";
import { MenuIcon } from "@/components/icons/SmallIcons";
import { NAV_ITEMS, isCurrentNavItem } from "@/components/layout/navItems";
import { SpMenu } from "@/components/layout/SpMenu";
import { makeOutsideSpMenuInert } from "@/components/layout/spMenuInert";
import { TelNumber } from "@/components/layout/TelNumber";
import { CLINIC_ADDRESS, CLINIC_NAME, CLINIC_POSTAL_CODE } from "@/lib/clinic";

const SP_MENU_ID = "site-header-sp-menu";
// PCのヘッダーを出す幅。Tailwindの xl と揃える（下の matchMedia もこの値で見る）
const PC_HEADER_MEDIA_QUERY = "(min-width: 1280px)";

/**
 * ナビ項目の下線（Figma: current。幅20・高さ2、項目の上端から54px）。
 * 現在地・ホバー・focus-visibleで同じ見た目にする（Figmaで3つとも同じ絵のため）
 */
const NAV_LINK_BASE_CLASS =
  "relative flex flex-col items-center gap-[7px] text-[11px]/[1.5] font-bold transition-colors duration-300 motion-reduce:transition-none after:absolute after:top-[54px] after:left-1/2 after:h-[2px] after:w-5 after:-translate-x-1/2 after:bg-main after:transition-opacity after:duration-300 motion-reduce:after:transition-none";
const NAV_LINK_CURRENT_CLASS = "text-main after:opacity-100";
const NAV_LINK_IDLE_CLASS =
  "text-contrast after:opacity-0 hover:text-main hover:after:opacity-100 focus-visible:text-main focus-visible:after:opacity-100";

export function SiteHeader() {
  const pathname = usePathname();
  // 開閉を「開いたときのURL」で持ち、今のURLと同じ間だけ開いているとみなす。ブラウザの戻るなどで
  // ページが変わると、閉じる処理を呼ばなくても閉じる（useEffectで閉じ直すと1回余計に描画される）
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const isMenuOpen = menuOpenedAt === pathname;
  // ページが変わったら開いたときのURLも捨てる。残すと、戻るで元のページに帰ったときにまた開いてしまう
  if (menuOpenedAt !== null && !isMenuOpen) setMenuOpenedAt(null);

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    // メニューが画面を覆っている間、背後のページが動くと操作先を見失うため止める
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 見えていない裏のページへTabで移れないようにする（ヘッダーとSP固定バーは除く）
    const restoreOutside = headerRef.current
      ? makeOutsideSpMenuInert(headerRef.current)
      : undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpenedAt(null);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);

    // メニュー外のリンク（SP固定バーの予約ボタン）で今いるページへ飛ぶとURLが変わらず閉じないので、押した時点で閉じる。
    // フォーカスは戻さない：メニュー内のリンクと同じく、押したリンクに残すかページ側に任せる
    const closeOnOutsideLinkClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (link && !headerRef.current?.contains(link)) setMenuOpenedAt(null);
    };
    document.addEventListener("click", closeOnOutsideLinkClick);

    // 開いたまま画面をPC幅に広げるとメニューは消えるが、スクロール停止だけが残ってしまうため閉じる
    const pcMedia = window.matchMedia(PC_HEADER_MEDIA_QUERY);
    const closeOnPcWidth = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpenedAt(null);
    };
    pcMedia.addEventListener("change", closeOnPcWidth);

    return () => {
      document.body.style.overflow = originalOverflow;
      restoreOutside?.();
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("click", closeOnOutsideLinkClick);
      pcMedia.removeEventListener("change", closeOnPcWidth);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setMenuOpenedAt(null);
    // 閉じるボタンはメニューと一緒に消えるので、フォーカスを開いたボタンへ戻す
    menuButtonRef.current?.focus();
  };

  return (
    // z-30：SPメニュー（この中のfixed）ごと本文より上に出す。SP固定バー(z-50)よりは下。
    // 影はbox-shadowで付ける（Figmaはdrop-shadowだが、filterを付けると中のfixedのメニューが
    // 画面ではなくヘッダー基準で配置されてしまうため。四角形なので見た目は同じ）
    <header
      ref={headerRef}
      className="relative z-30 bg-white shadow-[0_3px_3px_rgba(0,0,0,0.16)]"
    >
      {/* Figmaの寸法（ロゴとナビの間165px）は1280px幅ぴったりの値なので、固定の間隔ではなく
          justify-betweenで両端に寄せる。これで1280px未満の幅でもはみ出さない */}
      <div className="flex h-[60px] items-center justify-between gap-4 px-5 py-[14px] xl:h-20 xl:px-10 xl:py-2">
        <Link href="/" className="min-w-0">
          <Image
            src="/images/common/logo.svg"
            alt={CLINIC_NAME}
            width={270}
            height={32}
            preload
            loading="eager"
            className="h-auto w-[270px] max-w-full"
          />
        </Link>

        {/* ナビ6項目＋電話番号の必要幅は約1115px。1024pxでは入らないため、PC版はxl(1280px)から出す */}
        <div className="hidden items-center gap-8 xl:flex">
          <nav aria-label="グローバルナビゲーション">
            <ul className="flex items-start gap-6">
              {NAV_ITEMS.map((item) => {
                const isCurrent = isCurrentNavItem(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`${NAV_LINK_BASE_CLASS} ${isCurrent ? NAV_LINK_CURRENT_CLASS : NAV_LINK_IDLE_CLASS}`}
                    >
                      <NavIcon name={item.icon} className="size-6" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex w-[261px] flex-col items-end">
            <p className="text-xs/[1.5]">
              {CLINIC_POSTAL_CODE} {CLINIC_ADDRESS}
            </p>
            <TelNumber className="w-full" />
          </div>
        </div>

        {/* SPにしかない部品なのでホバーは付けない */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls={SP_MENU_ID}
          aria-label="メニューを開く"
          onClick={() => setMenuOpenedAt(pathname)}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-main xl:hidden"
        >
          <MenuIcon className="size-8" />
        </button>
      </div>

      <SpMenu
        id={SP_MENU_ID}
        isOpen={isMenuOpen}
        pathname={pathname}
        onClose={closeMenu}
        // 今いるページのリンクを押すとURLが変わらず自然には閉じないので、押した時点で閉じる
        onNavigate={() => setMenuOpenedAt(null)}
      />
    </header>
  );
}
