import type { Metadata } from "next";
import "./globals.css";

// 仮のサイト名。ヘッダー・フッターを作るときに、表記をFigmaに合わせて lib/ へ移す
const SITE_NAME = "OPEN CAFE";

const SITE_DESCRIPTION = `${SITE_NAME}のWebサイト（ポートフォリオ用の架空サイト）`;

// OGP画像は絶対URLでないとSNS側が読み取れない。公開先が決まったら
// NEXT_PUBLIC_SITE_URL に本番ドメインを入れる（未設定なら開発サーバー扱い）
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  // 架空のカフェのポートフォリオ用サイトのため、検索結果に出ないようにする。
  // 下層ページのmetadataはこの設定を引き継ぐ
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
