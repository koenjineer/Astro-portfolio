"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MOBILE_MENU_ID = "site-header-mobile-menu";
const HEADER_HEIGHT_SP = "60px";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "トップ", href: "/" },
  { label: "当社について", href: "/about" },
  { label: "サービス", href: "/service" },
  { label: "導入事例", href: "/case" },
  { label: "お知らせ", href: "/news" },
];

/**
 * 現在地の判定。トップだけは完全一致で見る（"/" は全パスの先頭に一致してしまうため）。
 * 下層（/news/<slug> や /news/page/2）でも親のナビ項目を現在地として光らせる。
 */
function isCurrentNavItem(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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

      <div className="hidden items-center gap-[30px] lg:flex">
        <nav aria-label="グローバルナビゲーション">
          <ul className="flex items-center gap-4 text-sm font-medium text-contrast">
            {NAV_ITEMS.map((item, index) => {
              const isCurrent = isCurrentNavItem(pathname, item.href);

              return (
                <li key={item.label} className="flex items-center gap-4">
                  {/* Figmaは項目のあいだを「／」で区切る。読み上げには意味が無いので飾り扱い */}
                  {index > 0 && <span aria-hidden="true">／</span>}
                  {/* 現在地は常時2pxの下線、ホバーは1pxの下線。太さを変えて
                      「今いるページ」と「指しているだけのページ」を見分けられるようにする。
                      現在地にはホバーのclassを当てない（後から来る方が勝って細くなるため） */}
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={
                      isCurrent
                        ? "text-main underline decoration-2 underline-offset-8"
                        : "underline-offset-8 transition-colors duration-300 hover:text-main hover:underline focus-visible:text-main focus-visible:underline motion-reduce:transition-none"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex gap-[10px]">
          {/* ルールセット「枠線+白背景」：ホバーで背景を塗りつぶす */}
          <Link
            href="/download"
            className="flex h-[68px] w-[176px] items-center justify-center border border-main bg-white text-sm font-medium text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none"
          >
            資料ダウンロード
          </Link>
          {/* ルールセット「背景塗りつぶし」：ホバーで背景色を濃くする */}
          <Link
            href="/contact"
            className="flex h-[68px] w-[176px] items-center justify-center bg-main text-sm font-medium text-white transition-colors duration-300 hover:bg-main-dark focus-visible:bg-main-dark motion-reduce:transition-none"
          >
            お問い合わせ
          </Link>
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
          {NAV_ITEMS.map((item) => {
            const isCurrent = isCurrentNavItem(pathname, item.href);

            return (
              <li key={item.label}>
                {/* ホバーは付けない（タッチでは発火しない）。現在地の下線だけ出す */}
                <Link
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    isCurrent ? "underline decoration-2 underline-offset-8" : ""
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex w-full max-w-[295px] flex-col gap-8">
          <Link
            href="/download"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-[68px] items-center justify-center border border-white text-base font-medium text-white"
          >
            資料ダウンロード
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-[68px] items-center justify-center bg-white text-base font-medium text-main"
          >
            お問い合わせ
          </Link>
        </div>
      </nav>
    </header>
  );
}
