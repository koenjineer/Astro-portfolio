import type { Metadata } from "next";
import { getCaseCourseGroups } from "@/lib/queries/case";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CaseCourseNav } from "./_components/CaseCourseNav";
import { CaseCourseSection } from "./_components/CaseCourseSection";

export const metadata: Metadata = {
  title: "導入事例 | Global Standard",
};

export default async function CasePage() {
  const courseGroups = await getCaseCourseGroups();

  return (
    <main className="flex flex-col">
      <SiteHeader />
      <PageHero
        eyebrow="CASE STUDY"
        title="導入事例"
        imagePcSrc="/images/case/hero-pc.webp"
        imageSpSrc="/images/case/hero-sp.webp"
      />
      <Breadcrumb items={[{ label: "導入事例" }]} />

      <div className="flex flex-col gap-[60px] pt-[60px] pb-[100px] lg:gap-20 lg:pt-[70px] lg:pb-40">
        <CaseCourseNav courses={courseGroups} />
        {courseGroups.map((group) => (
          <CaseCourseSection key={group.slug} group={group} />
        ))}
      </div>

      <SiteFooter />
    </main>
  );
}
