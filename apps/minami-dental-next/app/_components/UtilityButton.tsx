import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/SmallIcons";

interface UtilityButtonProps {
  href: string;
  children: string;
}

/**
 * 矢印つきの白いボタン（Figma: button-utility-pc）。CONCEPTとスタッフブログの2か所で使う。
 * 幅は文字に合わせて伸びる（Figmaも「当院について」176px・「スタッフブログ一覧はこちら」274pxと文字ぶん違う）。
 *
 * 矢印はボタンの右端から11pxの位置に浮かせる（Figmaと同じ）。文字の並びに入れると、
 * 文字が短いボタンでは矢印が中央寄りに来てしまうため。
 * ホバーは docs/design-rules.md の約束どおり、色は transition-colors・矢印の移動は transition-transform に分け、
 * ホバーと同じ見た目を focus-visible にも当てる
 */
export function UtilityButton({ href, children }: UtilityButtonProps) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center justify-center rounded-3xl border border-main bg-white px-[46px] py-[11px] text-sm/[1.5] whitespace-nowrap text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none"
    >
      {children}
      <ArrowRightIcon className="absolute right-[11px] size-3 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" />
    </Link>
  );
}
