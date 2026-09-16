/** サイト名。<title>・OGP・ロゴの代わりの文字に使う */
export const SITE_NAME = "OPEN CAFE";

/** フッターのコピーライト（Figmaの原稿のまま） */
export const COPYRIGHT_TEXT = "©︎2000-2021 open cafe. All Rights Reserved.";

export interface NavItem {
  /** 末尾スラッシュ付き（next.config.ts の trailingSlash と揃える） */
  href: string;
  /** 英字の項目名。表示は大文字だが、Figmaの原稿が小文字なので小文字で持ち、CSSで大文字にする */
  labelEn: string;
  labelJa: string;
}

/** ドロワーメニューの項目（Figma: 【PC】ドロワーメニュー 19742:14510 の並び順） */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", labelEn: "top", labelJa: "トップ" },
  { href: "/concept/", labelEn: "concept", labelJa: "コンセプト" },
  { href: "/menu/", labelEn: "menu", labelJa: "メニュー" },
  { href: "/news/", labelEn: "news", labelJa: "お知らせ" },
  { href: "/shop/", labelEn: "shop", labelJa: "店舗情報" },
  { href: "/products/", labelEn: "gift", labelJa: "ギフト・贈り物" },
  { href: "/contact/", labelEn: "contact", labelJa: "お問い合わせ" },
];

/**
 * 今いるページがナビ項目の配下か。お問い合わせ完了（/contact/thanks/）もお問い合わせの配下として扱う。
 * usePathname は末尾スラッシュを付けずに返すことがあるので、比べる前に揃える
 */
export function isCurrentNavItem(pathname: string, href: string): boolean {
  const normalizedPathname = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (href === "/") return normalizedPathname === "/";
  return normalizedPathname.startsWith(href);
}

export interface ShopInfoRow {
  label: string;
  /** Figmaで改行している所で分ける */
  lines: string[];
}

/**
 * フッターの店舗情報。Figmaの文言を固定で持つ。
 * WordPressの shops は3店舗あり、フッターの1件とどれが対応するか決まっていないため（店舗情報ページ着手時に見直す）。
 * 並びはSPの縦1列の順。PCの2列（左：住所・TEL・Mail／右：営業時間・定休日・座席）はCSSで列方向に流して作る
 */
export const FOOTER_SHOP_INFO: ShopInfoRow[] = [
  { label: "住所", lines: ["〒000-0000", "東京都武蔵野市吉祥寺南町一丁目"] },
  { label: "TEL", lines: ["0123-456-789"] },
  { label: "Mail", lines: ["example@mail.com"] },
  { label: "営業時間", lines: ["7:00〜21:00", "※ラストオーダー 20:30"] },
  { label: "定休日", lines: ["水曜日"] },
  { label: "座席", lines: ["テーブル20席 ／ カウンター席6席"] },
];
