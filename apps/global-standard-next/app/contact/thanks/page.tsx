import type { Metadata } from "next";
import { ContactPageShell } from "../_components/ContactPageShell";
import { ContactThanks } from "../_components/ContactThanks";

export const metadata: Metadata = {
  title: "お問い合わせ完了 | Global Standard",
};

export default function ContactThanksPage() {
  return (
    <ContactPageShell
      breadcrumbItems={[
        { label: "お問い合わせ", href: "/contact" },
        { label: "お問い合わせ完了" },
      ]}
    >
      <ContactThanks />
    </ContactPageShell>
  );
}
