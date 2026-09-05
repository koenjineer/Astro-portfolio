"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const MOBILE_MENU_ID = "site-header-mobile-menu";
const HEADER_HEIGHT_SP = "60px";

interface NavItem {
  label: string;
  href: string;
}

// 遷移先ページ未実装のため#
const NAV_ITEMS: NavItem[] = [
  { label: "トップ", href: "/" },
  { label: "当社について", href: "#" },
  { label: "サービス", href: "/service" },
  { label: "導入事例", href: "#" },
  { label: "お知らせ", href: "#" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    // メニューが画面を覆っている間、背後のページが動くと操作先を見失うため止める
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  return (
    <header className="relative z-50 flex h-[60px] items-center justify-between gap-4 border-b border-contrast-light/20 bg-white px-5 lg:h-auto lg:px-8 lg:py-4">
      <p className="font-fira-sans text-2xl text-main italic lg:text-4xl">
        Global standard
      </p>

      <div className="hidden items-center gap-8 lg:flex">
        <nav aria-label="グローバルナビゲーション">
          <ul className="flex items-center gap-4 text-sm font-medium text-contrast">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex">
          <a
            href="#"
            className="flex h-[68px] w-[176px] items-center justify-center border border-main bg-white text-sm font-medium text-main"
          >
            資料ダウンロード
          </a>
          <a
            href="#"
            className="flex h-[68px] w-[176px] items-center justify-center bg-main text-sm font-medium text-white"
          >
            お問い合わせ
          </a>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls={MOBILE_MENU_ID}
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex size-[27px] cursor-pointer items-center justify-center lg:hidden"
      >
        {/* 開閉でアイコンの縦横比が異なるため、width/heightもあわせて切り替える */}
        {isMenuOpen ? (
          <Image
            src="/images/common/icon-menu-close.svg"
            alt=""
            aria-hidden="true"
            width={27}
            height={22}
            priority
          />
        ) : (
          <Image
            src="/images/common/icon-menu.svg"
            alt=""
            aria-hidden="true"
            width={27}
            height={18}
            priority
          />
        )}
      </button>

      <nav
        id={MOBILE_MENU_ID}
        aria-label="モバイルメニュー"
        hidden={!isMenuOpen}
        style={{ top: HEADER_HEIGHT_SP }}
        className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-10 overflow-y-auto bg-main px-10 py-[60px] lg:hidden"
      >
        {/* leading-[23px]: Figmaの行高。既定の24pxだと5項目で画面からはみ出す */}
        <ul className="flex flex-col items-center gap-[41px] text-base leading-[23px] text-white">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex w-full max-w-[295px] flex-col gap-8">
          <a
            href="#"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-[68px] items-center justify-center border border-white text-base font-medium text-white"
          >
            資料ダウンロード
          </a>
          <a
            href="#"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-[68px] items-center justify-center bg-white text-base font-medium text-main"
          >
            お問い合わせ
          </a>
        </div>
      </nav>
    </header>
  );
}
