import type { Metadata } from "next";
import { ContactForm } from "./_components/ContactForm";
import { ContactPageShell } from "./_components/ContactPageShell";

export const metadata: Metadata = {
  title: "お問い合わせ | Global Standard",
};

/** 改行はFigmaの原稿どおり（PCは2行、SPは1文めが折り返して3行になる） */
const LEAD =
  "研修のお申し込み、その他お問い合わせは、下記のフォームからお問い合わせ内容をご記入ください。\n2日以内に担当者からメールにてご連絡いたします。";

export default function ContactPage() {
  return (
    <ContactPageShell breadcrumbItems={[{ label: "お問い合わせ" }]}>
      <div className="flex flex-col gap-[60px] lg:gap-20">
        <p className="text-sm leading-6 whitespace-pre-line text-contrast">
          {LEAD}
        </p>

        <ContactForm />
      </div>
    </ContactPageShell>
  );
}
