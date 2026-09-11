import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { NavIcon } from "@/components/icons/NavIcon";
import { ArrowRightIcon, CloseIcon } from "@/components/icons/SmallIcons";
import { NAV_ITEMS, isCurrentNavItem } from "@/components/layout/navItems";
import { CLINIC_NAME } from "@/lib/clinic";

interface SpMenuProps {
  id: string;
  isOpen: boolean;
  pathname: string;
  /** 閉じるボタン用。開閉ボタンへフォーカスを戻す */
  onClose: () => void;
  /** リンクを押したとき用。移動先でフォーカスが先頭に戻るので、開閉ボタンへは戻さない */
  onNavigate: () => void;
}

/**
 * SPメニュー（開いた状態。Figma: header-sp の「オープン」）。
 * 画面全体を覆い、下端のSP固定バー(z-50)はメニューの上にそのまま残る（Figmaでも同じ位置に出ている）。
 * SPにしかない部品なのでホバーは付けない。
 */
export function SpMenu({
  id,
  isOpen,
  pathname,
  onClose,
  onNavigate,
}: SpMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 開くボタンはメニューの下に隠れるので、キーボード操作の続きを閉じるボタンから始められるようにする
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  return (
    // pb-[60px]：SP固定バーの高さ分。最後の項目がバーの下に潜らないようにする
    <div
      id={id}
      hidden={!isOpen}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-main-dark pb-[60px] xl:hidden"
    >
      <div className="flex h-[60px] shrink-0 items-center justify-between gap-4 px-5 py-[14px]">
        <Link href="/" onClick={onNavigate} className="min-w-0">
          <Image
            src="/images/common/logo-white.svg"
            alt={CLINIC_NAME}
            width={270}
            height={32}
            loading="lazy"
            className="h-auto w-[270px] max-w-full"
          />
        </Link>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="メニューを閉じる"
          onClick={onClose}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-white"
        >
          <CloseIcon className="size-8" />
        </button>
      </div>

      {/* Figmaは左右60pxの余白（375px幅で項目幅255px）。余白を固定せず、幅の上限で中央に置く */}
      <nav
        aria-label="メニュー"
        className="flex flex-1 flex-col items-center justify-center px-5"
      >
        <ul className="w-full max-w-[255px]">
          {NAV_ITEMS.map((item) => {
            const isCurrent = isCurrentNavItem(pathname, item.href);

            return (
              <li
                key={item.href}
                className="border-b border-dashed border-white first:border-t"
              >
                {/* Figmaに現在地の見た目は無いので、読み上げ用の aria-current だけ付ける */}
                <Link
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={onNavigate}
                  className="flex items-center justify-between py-[15px] text-sm/[1.5] text-white"
                >
                  <span className="flex items-center gap-[14px]">
                    <NavIcon name={item.icon} className="size-6" />
                    {item.label}
                  </span>
                  <ArrowRightIcon className="size-[15.4px] shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
