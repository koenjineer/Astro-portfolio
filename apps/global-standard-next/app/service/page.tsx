import type { Metadata } from "next";
import { getServiceFaqItems } from "@/lib/queries/service";
import { ServiceHero } from "./_components/ServiceHero";
import { ServicePrograms } from "./_components/ServicePrograms";
import { ServiceFlow } from "./_components/ServiceFlow";
import { ServiceFaq } from "./_components/ServiceFaq";
import { ServiceFooter } from "./_components/ServiceFooter";

export const metadata: Metadata = {
  title: "サービス | Global Standard",
};

export default async function ServicePage() {
  const faqItems = await getServiceFaqItems();

  return (
    <main className="flex flex-col">
      <ServiceHero />
      <ServicePrograms />
      <ServiceFlow />
      <ServiceFaq items={faqItems} />
      <ServiceFooter />
    </main>
  );
}
