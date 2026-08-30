import Image from "next/image";
import type { FaqItem } from "@/lib/queries/service";

interface ServiceFaqProps {
  items: FaqItem[];
}

export function ServiceFaq({ items }: ServiceFaqProps) {
  return (
    <section
      aria-labelledby="service-faq-heading"
      className="flex flex-col items-center gap-10 px-5 py-16 lg:gap-14 lg:px-[90px] lg:py-20"
    >
      <h2
        id="service-faq-heading"
        className="text-xl font-bold text-contrast lg:text-2xl"
      >
        よくある質問
      </h2>

      <ul className="w-full max-w-[688px] divide-y divide-[#ddd] border-t border-[#ddd]">
        {items.map((item) => (
          <li key={item.question}>
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 marker:content-none">
                <span className="text-base font-bold text-contrast group-open:text-accent-2 lg:text-xl">
                  {item.question}
                </span>
                <Image
                  src="/images/service/icon-plus.svg"
                  alt=""
                  aria-hidden="true"
                  width={21}
                  height={21}
                  loading="lazy"
                  className="mt-1 shrink-0 group-open:hidden"
                />
                <Image
                  src="/images/service/icon-close.svg"
                  alt=""
                  aria-hidden="true"
                  width={30}
                  height={30}
                  loading="lazy"
                  className="mt-1 hidden shrink-0 group-open:block"
                />
              </summary>
              <p className="pt-4 text-sm leading-6 font-medium text-contrast">
                {item.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
