import Image from "next/image";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
}

/**
 * デフォルトボタン（ルールセット 19709:5885、ホバー 19719:11345）。
 * 黒い面の右下に6pxずらした枠線があり、ホバーで黒い面がその枠へずれて「右下に凹む」。
 * 動きは transition-transform で付ける（角括弧で書くと translate が外れる。/rules/tailwind.md）
 */
export function Button({ children, type = "button" }: ButtonProps) {
  return (
    <button type={type} className="group relative h-[78px] w-[296px] cursor-pointer">
      <span
        aria-hidden="true"
        className="absolute inset-0 top-1.5 left-1.5 border-r border-b border-contrast"
      />
      <span className="absolute inset-0 right-1.5 bottom-1.5 flex items-center justify-center bg-contrast text-base/[1.5] font-bold text-white transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-focus-visible:translate-x-1.5 group-focus-visible:translate-y-1.5 motion-reduce:transition-none">
        {children}
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
    </button>
  );
}
