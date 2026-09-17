import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  /** `href` を渡したときは使わない（リンクとして描く） */
  type?: "button" | "submit";
  /** 渡すとボタンではなくリンクになる（TOPの「詳しくはこちら」など、ページを移るもの） */
  href?: string;
  /** サイトの外へのリンク。新しいタブで開き、そのことを読み上げでも伝える */
  external?: boolean;
}

/**
 * デフォルトボタン（ルールセット 19709:5885、ホバー 19719:11345）。
 * 黒い面の右下に6pxずらした枠線があり、ホバーで黒い面がその枠へずれて「右下に凹む」。
 * 動きは transition-transform で付ける（角括弧で書くと translate が外れる。/rules/tailwind.md）
 *
 * ページを移る操作は `<button>` ではなくリンクにする（読み上げで「リンク」と伝わり、新しいタブでも開けるため）。
 * 見た目は同じなので、中身は共通にする
 */
export function Button({ children, type = "button", href, external = false }: ButtonProps) {
  const face = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 top-1.5 left-1.5 border-r border-b border-contrast"
      />
      <span className="absolute inset-0 right-1.5 bottom-1.5 flex items-center justify-center bg-contrast text-base/[1.5] font-bold text-white transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-focus-visible:translate-x-1.5 group-focus-visible:translate-y-1.5 motion-reduce:transition-none">
        {children}
        {external && <span className="sr-only">（新しいタブで開きます）</span>}
        <Image
          src="/images/common/icon-arrow.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={24}
          loading="lazy"
          className="absolute top-6 right-[22px] h-6 w-4"
        />
      </span>
    </>
  );

  // リンクは既定で inline なので block にして、ボタンと同じ大きさの箱にする
  const linkClassName = "group relative block h-[78px] w-[296px]";

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {face}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={linkClassName}>
        {face}
      </Link>
    );
  }

  return (
    <button type={type} className="group relative h-[78px] w-[296px] cursor-pointer">
      {face}
    </button>
  );
}
