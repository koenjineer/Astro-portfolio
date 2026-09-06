import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

interface ContactPageShellProps {
  /** 「トップ」の後ろに続く項目。先頭の「トップ」はBreadcrumbが自分で付ける */
  breadcrumbItems: BreadcrumbItem[];
  /** 本文（入力フォーム／完了メッセージ） */
  children: ReactNode;
}

/**
 * お問い合わせの入力ページと完了ページで共通の外枠。
 * 資料ダウンロードと違い背景色つきのカードは無く、白地の1カラムを中央に置くだけ。
 */
export function ContactPageShell({
  breadcrumbItems,
  children,
}: ContactPageShellProps) {
  return (
    <main className="flex flex-col">
      <SiteHeader />
      <PageHero
        eyebrow="CONTACT"
        title="お問い合わせ"
        imagePcSrc="/images/contact/hero-pc.webp"
        imageSpSrc="/images/contact/hero-sp.webp"
      />
      <Breadcrumb items={breadcrumbItems} />

      <div className="px-5 pt-[60px] pb-[100px] lg:px-[90px] lg:pt-[70px] lg:pb-40">
        {/* Figmaの本文はPCで687px幅。左右90pxの余白の内側（1100px）でさらに中央寄せになるので、
            結果として画面の中央に来る */}
        <div className="mx-auto w-full max-w-[687px]">{children}</div>
      </div>

      <SiteFooter />
    </main>
  );
}
