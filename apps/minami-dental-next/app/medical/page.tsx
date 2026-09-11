import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ContentWidth } from "@/components/layout/ContentWidth";
import { PageHero } from "@/components/layout/PageHero";
import { SITE_NAME } from "@/lib/clinic";
import { getMedicals, groupMedicalsByType } from "@/lib/queries/medical";
import { MedicalNav } from "./_components/MedicalNav";
import { MedicalSection } from "./_components/MedicalSection";

export const metadata: Metadata = {
  title: `診療案内 | ${SITE_NAME}`,
};

export default async function MedicalPage() {
  const medicalGroups = groupMedicalsByType(await getMedicals());

  return (
    <main className="flex-1">
      <PageHero
        title="診療案内"
        eyebrow="MEDICAL"
        imagePcSrc="/images/medical/hero-pc.webp"
        imageSpSrc="/images/medical/hero-sp.webp"
      />
      <Breadcrumb items={[{ label: "診療案内" }]} />

      <div className="flex flex-col gap-[100px] pt-[60px] pb-[100px] lg:gap-40 lg:pt-20 lg:pb-40">
        <ContentWidth>
          <MedicalNav groups={medicalGroups} />
        </ContentWidth>
        {/* 波の帯は画面の端から端まで敷くので、幅の上限の外に置く（中身の幅は帯の中で決める） */}
        {medicalGroups.map((group) => (
          <MedicalSection key={group.type.slug} group={group} />
        ))}
      </div>
    </main>
  );
}
