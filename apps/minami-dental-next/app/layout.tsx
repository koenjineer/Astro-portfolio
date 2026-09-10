import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

// ルールセットの太さはMedium/Boldの2種だけ。使わない太さを読むと転送量が増えるだけなので2つに絞る
const mPlusRounded = M_PLUS_Rounded_1c({
  variable: "--font-m-plus-rounded",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const SITE_NAME = "みなみ歯科";
const SITE_DESCRIPTION = "みなみ歯科のWebサイト（ポートフォリオ用の架空サイト）";

// OGP画像は絶対URLでないとSNS側が読み取れない。公開先が決まったら
// NEXT_PUBLIC_SITE_URL に本番ドメインを入れる（未設定なら開発サーバー扱い）
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  // 架空の歯科医院のポートフォリオ用サイトのため、検索結果に出ないようにする。
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
    <html lang="ja" className={`${mPlusRounded.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
