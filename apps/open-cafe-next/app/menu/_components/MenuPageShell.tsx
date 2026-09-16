import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import {
  MENU_EYEBROW,
  MENU_HERO_IMAGE_PC_SRC,
  MENU_HERO_IMAGE_SP_SRC,
  MENU_TITLE,
} from "@/lib/menuRoutes";
import type { Genre } from "@/lib/queries/menu";
import { GenreTabs } from "./GenreTabs";

interface MenuPageShellProps {
  genres: Genre[];
  /** ジャンル別ページのときだけ渡す（タブの現在地になる） */
  currentGenreSlug?: string;
  breadcrumbItems: BreadcrumbItem[];
  /** タブの下に並べる塊（料理のカード・ドリンクの表）。塊どうしの間はここで空ける */
  children: ReactNode;
}

/**
 * メニュー一覧とジャンル別の外枠（Figma: 19716:1875 / 19730:4292 / 19730:4837）。
 * 3つの画面とも「上部の写真＋タブ＋中身」で、違うのはパンくず・タブの現在地・中身だけなので1つにまとめる。
 * タブと中身、料理とドリンクの間はどちらもSP 60px / PC 80px
 */
export function MenuPageShell({
  genres,
  currentGenreSlug,
  breadcrumbItems,
  children,
}: MenuPageShellProps) {
  return (
    <SubPageLayout
      title={MENU_TITLE}
      eyebrow={MENU_EYEBROW}
      imagePcSrc={MENU_HERO_IMAGE_PC_SRC}
      imageSpSrc={MENU_HERO_IMAGE_SP_SRC}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-[60px] md:gap-20">
        <GenreTabs genres={genres} currentGenreSlug={currentGenreSlug} />
        {children}
      </div>
    </SubPageLayout>
  );
}
