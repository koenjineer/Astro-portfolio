import type { Metadata } from "next";
import { Amatic_SC, Damion, Noto_Serif_JP, Patua_One } from "next/font/google";
import { BackToTop } from "@/components/layout/BackToTop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

// ルールセットの太さだけに絞る（使わない太さを読むと転送量が増えるだけのため）
const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const amaticSc = Amatic_SC({
  variable: "--font-amatic-sc",
  subsets: ["latin"],
  weight: "700",
});

const patuaOne = Patua_One({
  variable: "--font-patua-one",
  subsets: ["latin"],
  weight: "400",
});

// ルールセットにはあるが、共通部分とお問い合わせでは使っていない。
// 先読みすると使わないページでも読み込まれるので、使われたときだけ読ませる
const damion = Damion({
  variable: "--font-damion",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const SITE_DESCRIPTION = `${SITE_NAME}のWebサイト（ポートフォリオ用の架空サイト）`;

// OGP画像は絶対URLでないとSNS側が読み取れない。公開先が決まったら
// NEXT_PUBLIC_SITE_URL に本番ドメインを入れる（未設定なら開発サーバー扱い）
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // 下層ページは title にページ名だけを書けば「ページ名 | サイト名」になる
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
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
    // motion-safe:scroll-smooth：「ページトップへ戻る」をなめらかに動かす（動きを減らす設定なら動かさない）。
    // data-scroll-behavior：ページ移動のときまでなめらかにスクロールしないよう、Next.jsに移動中だけ切らせる。
    // scrollbar-gutter：ドロワーを開くとスクロールを止めてスクロールバーが消え、裏のページが横にずれるため、その幅を常に取っておく
    <html
      lang="ja"
      data-scroll-behavior="smooth"
      className={`${notoSerifJp.variable} ${amaticSc.variable} ${patuaOne.variable} ${damion.variable} h-full antialiased motion-safe:scroll-smooth [scrollbar-gutter:stable]`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}
