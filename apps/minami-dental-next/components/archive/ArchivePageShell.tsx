import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";

// お知らせ・ブログで共通の写真（Figmaの素材「下層ページ上部」の archive）
const HERO_IMAGE_PC_SRC = "/images/archive/hero-pc.webp";
const HERO_IMAGE_SP_SRC = "/images/archive/hero-sp.webp";

interface ArchivePageShellProps {
  /** ページ上部の日本語の見出し（例: お知らせ） */
  title: string;
  /** ページ上部の英字の小見出し（例: NEWS） */
  eyebrow: string;
  /** 記事の詳細ページでは記事名をh1にするので、ページ上部の見出しを "p" にする */
  heroTitleAs?: "h1" | "p";
  /** 「ホーム」の後ろに続く項目。先頭の「ホーム」はBreadcrumbが自分で付ける */
  breadcrumbItems: BreadcrumbItem[];
  /** 右（SPでは下）に置くサイドバー */
  sidebar: ReactNode;
  /** 本文（一覧／記事） */
  children: ReactNode;
}

/**
 * お知らせ・ブログの一覧／カテゴリー別／詳細で共通の外枠。
 * Figmaは本文670px＋間30px＋サイドバー300px＝1000px の2段組み（SPは縦に積んで間100px）
 */
export function ArchivePageShell({
  title,
  eyebrow,
  heroTitleAs,
  breadcrumbItems,
  sidebar,
  children,
}: ArchivePageShellProps) {
  return (
    <main className="flex-1">
      <PageHero
        title={title}
        titleAs={heroTitleAs}
        eyebrow={eyebrow}
        imagePcSrc={HERO_IMAGE_PC_SRC}
        imageSpSrc={HERO_IMAGE_SP_SRC}
      />
      <Breadcrumb items={breadcrumbItems} />

      {/* 大きな固定の余白は付けず、小さな外側の余白＋幅の上限で中央に置く */}
      <div className="px-5 pt-[60px] pb-[100px] lg:pt-20 lg:pb-40">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-[100px] lg:flex-row lg:items-start lg:gap-[30px]">
          {/* サイドバーは300px固定、本文側を可変にして1024〜1280pxでも2段組みが崩れないようにする */}
          <div className="min-w-0 lg:flex-1">{children}</div>
          {sidebar}
        </div>
      </div>
    </main>
  );
}
