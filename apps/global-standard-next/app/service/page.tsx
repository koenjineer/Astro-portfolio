import type { Metadata } from "next";
import { getServiceFaqItems } from "@/lib/queries/service";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHero } from "@/components/layout/PageHero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ServicePrograms } from "./_components/ServicePrograms";
import { ServiceFlow } from "./_components/ServiceFlow";
import { ServiceFaq } from "./_components/ServiceFaq";

export const metadata: Metadata = {
  title: "サービス | Global Standard",
};

export default async function ServicePage() {
  const faqItems = await getServiceFaqItems();

  return (
    <main className="flex flex-col">
      <SiteHeader />
      <PageHero eyebrow="SERVICE" title="サービス" />
      <Breadcrumb items={[{ label: "サービス" }]} />
      <ServicePrograms />
      <ServiceFlow />
      <ServiceFaq items={faqItems} />
      <SiteFooter />
    </main>
  );
}
