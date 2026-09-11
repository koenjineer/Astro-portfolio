import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";

interface FormPageShellProps {
  /** ページ上部の日本語の見出し（例: WEB予約）。ページのh1になる */
  title: string;
  /** ページ上部の英字の小見出し（例: RESERVE） */
  eyebrow: string;
  /** 「ホーム」の後ろに続く項目。先頭の「ホーム」はBreadcrumbが自分で付ける */
  breadcrumbItems: BreadcrumbItem[];
  /** 本文（案内＋フォーム／完了メッセージ） */
  children: ReactNode;
}

/**
 * フォームのページ（WEB予約・お問い合わせの入力／完了）で共通の外枠。本文はPC 728px幅の1カラムを中央に置く。
 * ページ上部の写真はどれも contact/hero-*（WEB予約のFigmaの写真と見比べて、同じ写真・同じ切り抜きと確認済み）。
 * 違うのは見出しの文字だけなので、枠をページごとに複製せず1つにしている（片方だけ直す事故を防ぐため）
 */
export function FormPageShell({
  title,
  eyebrow,
  breadcrumbItems,
  children,
}: FormPageShellProps) {
  return (
    <main className="flex-1">
      <PageHero
        title={title}
        eyebrow={eyebrow}
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

interface FormPageSectionsProps {
  /** 上から「案内」「フォーム」の順に並べる */
  children: ReactNode;
}

/**
 * 入力ページの本文の並び（案内とフォームの縦並び）。
 * 間の余白（SP 100px / PC 150px）はFigmaで両ページ同じなので、ページごとに数字を書かず1か所で持つ
 */
export function FormPageSections({ children }: FormPageSectionsProps) {
  return (
    <div className="flex flex-col gap-[100px] lg:gap-[150px]">{children}</div>
  );
}
