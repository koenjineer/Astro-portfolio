import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AboutStatement } from "./_components/AboutStatement";
import { CompanyProfile } from "./_components/CompanyProfile";
import { DirectorProfiles } from "./_components/DirectorProfiles";

export const metadata: Metadata = {
  title: "当社について | Global Standard",
};

// 理念の文言は頻繁に変わらないため、固定テキストで持つ（WordPressからは取得しない）
const STATEMENTS = [
  {
    eyebrow: "MISSION",
    title: "社会的使命",
    messageLines: ["人財育成を通じて、", "豊かな世界を創造する"],
    messageBreakAt: "sp" as const,
    body: "急速に広がったグローバル社会に対応できる人材を育成することで、文化・言語の垣根を越えたコミュニケーションを活発にし、一人でも多くの人が豊かに暮らせる世界を実現することを使命とする。",
    imagePcSrc: "/images/about/mission-pc.webp",
    imageSpSrc: "/images/about/mission-sp.webp",
  },
  {
    eyebrow: "VISION",
    title: "企業理念",
    messageLines: ["文化の垣根を越えた", "人と人とのつながりが新しい価値を生む"],
    messageBreakAt: "pc" as const,
    body: "コミュニケーションスキル習得をサポートすることで一人でも多くのビジネスパーソンの視野を広げ、世界を舞台に新しい相乗効果を生む未来を創造する。文化の垣根を越えた人と人とのつながりが新しい価値を生むことを信念とする。",
    imagePcSrc: "/images/about/vision-pc.webp",
    imageSpSrc: "/images/about/vision-sp.webp",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col">
      <SiteHeader />
      <PageHero
        eyebrow="ABOUT US"
        title="当社について"
        imagePcSrc="/images/about/hero-pc.webp"
        imageSpSrc="/images/about/hero-sp.webp"
      />
      <Breadcrumb items={[{ label: "当社について" }]} />

      {/* SPは写真を画面幅いっぱいに敷くため、左右の余白はPCだけに付ける */}
      <div className="flex flex-col gap-[60px] py-[60px] lg:gap-[120px] lg:px-[90px] lg:pt-[70px] lg:pb-[120px]">
        {STATEMENTS.map((statement) => (
          <AboutStatement key={statement.eyebrow} {...statement} />
        ))}
      </div>

      <CompanyProfile />
      <DirectorProfiles />

      <SiteFooter />
    </main>
  );
}
