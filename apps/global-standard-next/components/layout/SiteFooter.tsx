import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";

interface FooterCta {
  href: string;
  englishLabel: string;
  label: string;
  imageSrc: string;
}

// 遷移先ページ未実装のため#（本格的な共通レイアウト実装は別タスク）
const FOOTER_CTAS: FooterCta[] = [
  {
    href: "#",
    englishLabel: "download",
    label: "資料ダウンロード",
    imageSrc: "/images/common/footer-download.webp",
  },
  {
    href: "#",
    englishLabel: "contact",
    label: "お問い合わせ",
    imageSrc: "/images/common/footer-contact.webp",
  },
];

export function SiteFooter() {
  return (
    <footer className="relative flex flex-col gap-8 bg-contrast p-0 text-white">
      <div className="flex flex-col gap-0 lg:flex-row lg:justify-center">
        {FOOTER_CTAS.map((cta) => (
          <a
            key={cta.label}
            href={cta.href}
            className="group relative z-0 flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 py-12 text-center lg:gap-8 lg:py-16"
          >
            <Image
              src={cta.imageSrc}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              loading="lazy"
              className="-z-10 object-cover"
            />

            <div className="flex flex-col gap-1">
              <span className="font-fira-sans text-3xl uppercase italic lg:text-[60px]">
                {cta.englishLabel}
              </span>
              <span className="text-sm font-bold">{cta.label}</span>
            </div>

            {/* ルールセット「矢印つき」：ホバーで黄色に塗りつぶし、文字とアイコン色を反転 */}
            <span className="flex items-center gap-3 border-2 border-accent-1 px-6 py-3 font-fira-sans text-sm text-accent-1 italic transition-colors duration-300 group-hover:bg-accent-1 group-hover:text-main group-focus-visible:bg-accent-1 group-focus-visible:text-main motion-reduce:transition-none lg:border-3 lg:px-8 lg:py-4 lg:text-2xl">
              View more
              {/* 8px: Figmaのホバー時、矢印がx=250→258へ移動する分 */}
              <ArrowRightIcon className="h-3 w-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-[8px] group-focus-visible:translate-x-[8px] motion-reduce:transition-none lg:h-[14px] lg:w-5" />
            </span>
          </a>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 text-center text-sm">
        <p className="font-fira-sans text-2xl italic">Global standard</p>
        <address className="not-italic">
          〒550-1000　大阪市西区土佐堀9-5-5
          <br />
          TEL　06-123-4567
          <br />
          FAX　06-123-4568
        </address>
      </div>

      <p className="text-center text-xs">
        ©︎2021 Global Standard. All Rights Reserved.
      </p>

      <a
        href="#"
        aria-label="ページトップへ戻る"
        className="absolute right-4 bottom-4 size-10 lg:right-5 lg:bottom-10"
      >
        <Image src="/images/common/icon-top-pc.svg" alt="" fill />
      </a>
    </footer>
  );
}
