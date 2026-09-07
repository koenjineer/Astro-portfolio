import Image from "next/image";
import type { CaseListItem } from "@/lib/queries/case";
import { HomeCaseCard } from "./HomeCaseCard";
import { SectionHeading } from "./SectionHeading";
import { ViewMoreLink } from "./ViewMoreLink";

interface HomeCaseStudyProps {
  caseItems: CaseListItem[];
}

export function HomeCaseStudy({ caseItems }: HomeCaseStudyProps) {
  return (
    <section
      aria-labelledby="home-case-heading"
      className="relative isolate px-5 py-[60px] lg:px-[90px] lg:pt-[100px] lg:pb-[122px]"
    >
      {/* ビルの写真を紺で覆って、白い文字とロゴを読ませる（当社についてページと同じ） */}
      <Image
        src="/images/home/case-bg-sp.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        loading="lazy"
        className="-z-20 object-cover lg:hidden"
      />
      <Image
        src="/images/home/case-bg-pc.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        loading="lazy"
        className="-z-20 hidden object-cover lg:block"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-main/80" />

      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col">
        <SectionHeading
          id="home-case-heading"
          english="CASE STUDY"
          japanese="導入事例"
          tone="white"
        />

        <ul className="mt-[47px] grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-3 lg:gap-[70px]">
          {caseItems.map((caseItem) => (
            <li key={caseItem.slug}>
              <HomeCaseCard caseItem={caseItem} />
            </li>
          ))}
        </ul>

        <ViewMoreLink
          href="/case"
          variant="white"
          label="導入事例のページへ"
          className="mt-[53px] self-end lg:absolute lg:top-[49px] lg:right-0 lg:mt-0"
        />
      </div>
    </section>
  );
}
