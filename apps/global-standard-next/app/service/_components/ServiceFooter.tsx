import Image from "next/image";

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
    imageSrc: "/images/service/footer-download.webp",
  },
  {
    href: "#",
    englishLabel: "contact",
    label: "お問い合わせ",
    imageSrc: "/images/service/footer-contact.webp",
  },
];

export function ServiceFooter() {
  return (
    <footer className="relative flex flex-col gap-8 bg-contrast px-5 py-12 text-white lg:px-[90px] lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-center lg:gap-16">
        {FOOTER_CTAS.map((cta) => (
          <a
            key={cta.label}
            href={cta.href}
            className="relative z-0 flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden border-2 border-accent-1 px-6 py-12 text-center lg:gap-8 lg:py-16"
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

            <span className="flex items-center gap-3 border-2 border-accent-1 px-6 py-3 font-fira-sans text-sm text-accent-1 italic lg:border-3 lg:px-8 lg:py-4 lg:text-2xl">
              View more
              <Image
                src="/images/service/icon-arrow-right-sp.svg"
                alt=""
                width={18}
                height={12}
                className="lg:hidden"
              />
              <Image
                src="/images/service/icon-arrow-right-pc.svg"
                alt=""
                width={20}
                height={14}
                className="hidden lg:block"
              />
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
        <Image src="/images/service/icon-top-pc.svg" alt="" fill />
      </a>
    </footer>
  );
}
