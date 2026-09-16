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
 * ナビ項目のhrefの前方一致では拾えない配下のページ。
 * お知らせのカテゴリー別一覧は指示書どおり `/archives/category/…`、メニューのジャンル別は `/genre/…` に置いたので、
 * URLの根元が `/news/`・`/menu/` と違う（CLAUDE.mdのURL設計）
 */
const EXTRA_NAV_PREFIXES: Record<string, string[]> = {
  "/menu/": ["/genre/"],
  "/news/": ["/archives/category/"],
};

/**
 * 今いるページがナビ項目の配下か。お問い合わせ完了（/contact/thanks/）もお問い合わせの配下として扱う。
 * usePathname は末尾スラッシュを付けずに返すことがあるので、比べる前に揃える
 */
export function isCurrentNavItem(pathname: string, href: string): boolean {
  const normalizedPathname = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (href === "/") return normalizedPathname === "/";
  if (normalizedPathname.startsWith(href)) return true;

  return (EXTRA_NAV_PREFIXES[href] ?? []).some((prefix) =>
    normalizedPathname.startsWith(prefix)
  );
}

export interface ShopInfoRow {
  label: string;
  /** Figmaで改行している所で分ける */
  lines: string[];
}

/**
 * フッターの店舗情報。Figmaの文言を固定で持つ。中身はWordPressの吉祥寺店と同じだが、
 * フッターは全ページに出るので、WordPressの取得に失敗すると全ページが落ちる形にはしない（Owner判断）。
 * 並びはSPの縦1列の順。PCの2列（左：住所・TEL・Mail／右：営業時間・定休日・座席）は ShopInfoList が作る
 */
export const FOOTER_SHOP_INFO: ShopInfoRow[] = [
  { label: "住所", lines: ["〒000-0000", "東京都武蔵野市吉祥寺南町一丁目"] },
  { label: "TEL", lines: ["0123-456-789"] },
  { label: "Mail", lines: ["example@mail.com"] },
  { label: "営業時間", lines: ["7:00〜21:00", "※ラストオーダー 20:30"] },
  { label: "定休日", lines: ["水曜日"] },
  { label: "座席", lines: ["テーブル20席 ／ カウンター席6席"] },
];

/**
 * 店舗情報ページに並べる順（Figma: 【PC】店舗情報 19719:6384）。
 * WordPressのslugは日本語で意味のある順にならないため、店名の配列で固定する。
 *
 * 文字列はWordPressのタイトルと完全に一致させる（「OPEN CAFE」と店名の間は全角スペース）。
 * 半角で書くと一致せず、エラーにならないまま並びだけが崩れる
 */
export const SHOP_TITLE_ORDER: string[] = [
  "OPEN CAFE　吉祥寺店",
  "OPEN CAFE　阿佐ヶ谷店",
  "OPEN CAFE　中野店",
];
