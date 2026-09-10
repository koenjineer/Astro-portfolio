import type { NavIconName } from "@/components/icons/NavIcon";

export interface NavItem {
  label: string;
  href: string;
  icon: NavIconName;
}

/** PCのグローバルナビとSPメニューで同じ6項目・同じ順番 */
export const NAV_ITEMS: NavItem[] = [
  { label: "ホーム", href: "/", icon: "home" },
  { label: "当院について", href: "/about/", icon: "about" },
  { label: "診療案内", href: "/medical/", icon: "medical" },
  { label: "スタッフ紹介", href: "/staff/", icon: "staff" },
  { label: "スタッフブログ", href: "/blog/", icon: "blog" },
  { label: "お問い合わせ", href: "/contact/", icon: "contact" },
];

/** hrefは末尾スラッシュ付き、usePathnameの戻り値は付くとは限らないので、落としてから比べる */
function withoutTrailingSlash(path: string) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

/**
 * 現在地の判定。ホームだけは完全一致で見る（"/" は全パスの先頭に一致してしまうため）。
 * 下層（/blog/<slug>/ や /news/page/2/）でも親の項目を現在地として扱う。
 */
export function isCurrentNavItem(pathname: string, href: string) {
  const current = withoutTrailingSlash(pathname);
  const target = withoutTrailingSlash(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}
