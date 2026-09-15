import type { Metadata } from "next";
import { ContactForm } from "./_components/ContactForm";
import {
  ContactIntro,
  ContactPageShell,
} from "./_components/ContactPageShell";

export const metadata: Metadata = {
  title: "お問い合わせ",
};

const FORM_HEADING_ID = "contact-form-heading";

export default function ContactPage() {
  return (
    <ContactPageShell breadcrumbItems={[{ label: "お問い合わせ" }]}>
      <section
        aria-labelledby={FORM_HEADING_ID}
        className="flex flex-col gap-[60px] md:gap-20"
      >
        <ContactIntro headingId={FORM_HEADING_ID} heading="お問い合わせフォーム">
          お問い合わせ内容に応じて、項目をご選択のうえ、お気軽にお問い合わせください。
        </ContactIntro>
        <ContactForm />
      </section>
    </ContactPageShell>
  );
}
