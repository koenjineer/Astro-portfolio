import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";

interface SubPageLayoutProps {
  /** 日本語の見出し（例: 店舗情報）。既定ではページのh1になる */
  title: string;
  /** 上部の見出しのタグ。記事詳細のように、本文側にh1があるページでは "p" を渡す */
  titleAs?: "h1" | "p";
  /** 英字の見出し。CSSで大文字にするのでFigmaの原稿どおり小文字で渡す */
  eyebrow: string;
  /** 下層トップの背景写真（ページごとに違う） */
  imagePcSrc: string;
  imageSpSrc: string;
  /** 「TOP」の後ろに続く項目。先頭の「TOP」は Breadcrumb が自分で付ける */
  breadcrumbItems: BreadcrumbItem[];
  children: ReactNode;
}

/**
 * 下層ページ共通の外枠（上部の写真・パンくず・本文の余白）。
 * Figmaでは下層ページの本文がどのページも「左右20px・上SP60px/PC80px・下160px」で同じなので1つにまとめている。
 *
 * 本文の幅の上限（ギフトは1100px、お問い合わせ・店舗情報は688px）はページごとに違うため、
 * ここでは持たずに children 側で指定する
 */
export function SubPageLayout({
  title,
  titleAs,
  eyebrow,
  imagePcSrc,
  imageSpSrc,
  breadcrumbItems,
  children,
}: SubPageLayoutProps) {
  return (
    <main className="flex-1">
      <PageHero
        title={title}
        titleAs={titleAs}
        eyebrow={eyebrow}
        imagePcSrc={imagePcSrc}
        imageSpSrc={imageSpSrc}
      />
      <Breadcrumb items={breadcrumbItems} />

      <div className="px-5 pt-[60px] pb-40 md:pt-20">{children}</div>
    </main>
  );
}
