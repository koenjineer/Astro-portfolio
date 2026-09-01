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
    englishLabel: "Download",
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
    <footer className="flex flex-col gap-8 bg-contrast px-5 py-12 text-white lg:px-[90px] lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-center lg:gap-16">
        {FOOTER_CTAS.map((cta) => (
          <a
            key={cta.label}
            href={cta.href}
            className="relative z-0 flex flex-1 flex-col items-center justify-center gap-1 overflow-hidden border-2 border-accent-1 py-8 text-center"
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
            <span className="font-fira-sans text-xl italic">
              {cta.englishLabel}
            </span>
            <span className="text-sm font-bold">{cta.label}</span>
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
    </footer>
  );
}
