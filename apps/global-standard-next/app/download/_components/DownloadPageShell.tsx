import Image from "next/image";
import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

interface DownloadPageShellProps {
  /** 「トップ」の後ろに続く項目。先頭の「トップ」はBreadcrumbが自分で付ける */
  breadcrumbItems: BreadcrumbItem[];
  /** 右カラムのカードの中身（入力フォーム／完了メッセージ） */
  children: ReactNode;
}

const LEAD_HEADING =
  "世界で活躍できるグローバルな人材を育てる３つの研修プログラムをご用意しております。";

/**
 * 研修プログラムの紹介文。頻繁に変わらないため固定テキストで持つ。
 * 改行はFigmaの原稿どおり（PC/SPどちらの幅でもデザインと同じ行数になる）
 */
const LEAD_PARAGRAPHS = [
  "急速にグローバルに活躍できる企業が生き残る時代と移り変わりました。\nビジネス英語や経営学を効率よく学びながら、世界各国から集まるビジネスパーソンと交流し、世界レベルでの人脈を構築する研修をご用意しております。",
  "英語に苦手意識のある方でもご安心ください。\nビジネスで必要なコミュニケーションが取れるようになるまで実績豊富な講師陣がサポートいたします。\nまずはこちらの資料をごらんください。",
];

/**
 * 資料ダウンロードの入力ページと完了ページで共通の外枠。
 * Figmaでは2ページとも左カラム510px＋カード550px・同じ余白で、左カラムの中身も同一なので、
 * 寸法とテキストを1か所にまとめて右カラムの中身だけ差し替える。
 */
export function DownloadPageShell({
  breadcrumbItems,
  children,
}: DownloadPageShellProps) {
  return (
    <main className="flex flex-col">
      <SiteHeader />
      <PageHero
        eyebrow="DOWNLOAD"
        title="資料ダウンロード"
        imagePcSrc="/images/download/hero-pc.webp"
        imageSpSrc="/images/download/hero-sp.webp"
      />
      <Breadcrumb items={breadcrumbItems} />

      <div className="px-5 pt-[60px] pb-[100px] lg:px-[90px] lg:pt-[70px] lg:pb-40">
        {/* PCは左510＋間40＋右550＝1100。カードの高さは既定のstretchで左カラムに揃う
            （Figmaの完了ページはカードが左カラムと同じ高さまで伸びている） */}
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-[60px] lg:flex-row lg:gap-10">
          <div className="flex flex-col items-center gap-10 lg:w-[510px] lg:shrink-0">
            <h2 className="w-full text-xl leading-7 font-bold text-contrast lg:text-[28px] lg:leading-10">
              {LEAD_HEADING}
            </h2>

            <Image
              src="/images/download/pamphlet.webp"
              alt="研修プログラム紹介資料「ビジネス英会話研修」の表紙"
              width={275}
              height={389}
              loading="lazy"
              className="shadow-[0px_3px_12px_0px_rgba(0,0,0,0.16)]"
            />

            {/* gap-6：Figmaの原稿で段落の間に入っている空行1行分（14px×leading24） */}
            <div className="flex w-full flex-col gap-6 text-sm leading-6 text-contrast">
              {LEAD_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] bg-main-light px-5 py-10 lg:w-[550px] lg:shrink-0 lg:p-10">
            {children}
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
