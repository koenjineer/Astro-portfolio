import type { Metadata } from "next";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { ContactForm } from "./_components/ContactForm";
import { ContactGuide } from "./_components/ContactGuide";

export const metadata: Metadata = {
  title: "お問い合わせ | みなみ歯科",
};

export default function ContactPage() {
  return (
    <FormPageShell
      title="お問い合わせ"
      eyebrow="CONTACT"
      breadcrumbItems={[{ label: "お問い合わせ" }]}
    >
      <div className="flex flex-col gap-[100px] lg:gap-[150px]">
        <ContactGuide />
        <ContactForm />
      </div>
    </FormPageShell>
  );
}
