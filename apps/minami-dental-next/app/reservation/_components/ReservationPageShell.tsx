import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";

interface ReservationPageShellProps {
  /** 「ホーム」の後ろに続く項目。先頭の「ホーム」はBreadcrumbが自分で付ける */
  breadcrumbItems: BreadcrumbItem[];
  /** 本文（予約の案内＋フォーム／完了メッセージ） */
  children: ReactNode;
}

/**
 * WEB予約の入力ページと完了ページで共通の外枠。本文はPC 728px幅の1カラムを中央に置く。
 * ページ上部の写真はお問い合わせと同じもの（Figmaの写真を見比べて同じ写真・同じ切り抜きと確認済み）
 */
export function ReservationPageShell({
  breadcrumbItems,
  children,
}: ReservationPageShellProps) {
  return (
    <main className="flex-1">
      <PageHero
        title="WEB予約"
        eyebrow="RESERVE"
        imagePcSrc="/images/contact/hero-pc.webp"
        imageSpSrc="/images/contact/hero-sp.webp"
      />
      <Breadcrumb items={breadcrumbItems} />

      <div className="px-5 pt-[60px] pb-[100px] lg:pt-20 lg:pb-40">
        <div className="mx-auto w-full max-w-[728px]">{children}</div>
      </div>
    </main>
  );
}
