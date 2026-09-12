import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ContentWidth } from "@/components/layout/ContentWidth";
import { PageHero } from "@/components/layout/PageHero";
import { SITE_NAME } from "@/lib/clinic";
import { ClinicGallery } from "./_components/ClinicGallery";
import { PolicySection } from "./_components/PolicySection";

export const metadata: Metadata = {
  title: `当院について | ${SITE_NAME}`,
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="当院について"
        eyebrow="ABOUT OUR CLINIC"
        imagePcSrc="/images/about/hero-pc.webp"
        imageSpSrc="/images/about/hero-sp.webp"
      />
      <Breadcrumb items={[{ label: "当院について" }]} />

      <div className="flex flex-col gap-[100px] pt-[60px] pb-[100px] lg:gap-[120px] lg:pt-20 lg:pb-40">
        {/* ポリシーと特徴は写真を画面の端に付けるので、幅の上限の外に置く（見出しと文章の幅は中で決める） */}
        <PolicySection />
        <ContentWidth>
          <ClinicGallery />
        </ContentWidth>
      </div>
    </main>
  );
}
