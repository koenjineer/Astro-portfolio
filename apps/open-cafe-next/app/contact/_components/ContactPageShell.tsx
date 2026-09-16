import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";

interface ContactPageShellProps {
  /** 「TOP」の後ろに続く項目 */
  breadcrumbItems: BreadcrumbItem[];
  children: ReactNode;
}

/**
 * お問い合わせの入力／完了で共通の外枠（上部の写真・パンくず・本文の枠）。
 * Figmaでは2ページとも同じ写真・同じ見出しで、違うのはパンくずと本文だけなので1つにしている。
 * 本文はPC 688px幅の1カラムを中央に置く
 */
export function ContactPageShell({
  breadcrumbItems,
  children,
}: ContactPageShellProps) {
  return (
    <main className="flex-1">
      <PageHero
        title="お問い合わせ"
        eyebrow="contact"
        imagePcSrc="/images/firstview/contact-pc.webp"
        imageSpSrc="/images/firstview/contact-sp.webp"
      />
      <Breadcrumb items={breadcrumbItems} />

      <div className="px-5 pt-[60px] pb-40 md:pt-20">
        <div className="mx-auto w-full max-w-[688px]">{children}</div>
      </div>
    </main>
  );
}

interface ContactIntroProps {
  /** 見出しに付けるid。見出しの下にフォームを続けるとき、section の aria-labelledby から指す */
  headingId?: string;
  heading: string;
  children: ReactNode;
}

/** 本文の先頭の見出し＋文（Figma: section）。入力ページと完了ページで同じ形 */
export function ContactIntro({ headingId, heading, children }: ContactIntroProps) {
  return (
    <div className="flex flex-col gap-[21px] text-main md:gap-6">
      <h2
        id={headingId}
        className="text-center text-xl/[1.5] font-bold md:text-[28px]/[1.5]"
      >
        {heading}
      </h2>
      <p className="text-sm/[2] md:text-base/[2]">{children}</p>
    </div>
  );
}
