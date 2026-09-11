import type { Metadata } from "next";
import { FormPageShell } from "@/components/layout/FormPageShell";
import { CLINIC_TEL } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "お問い合わせ完了 | みなみ歯科",
};

/**
 * 実際にはフォームを送信しないので返信は届かないが、
 * 架空の歯科医院のデザイン再現を優先してFigmaの文言のまま置く（WEB予約の完了ページと同じ判断）
 */
export default function ContactThanksPage() {
  return (
    <FormPageShell
      title="お問い合わせ"
      eyebrow="CONTACT"
      breadcrumbItems={[
        { label: "お問い合わせ", href: "/contact/" },
        { label: "お問い合わせ完了" },
      ]}
    >
      <p className="text-sm/[1.7]">
        お問い合わせありがとうございました。
        <br />
        3営業日以内に返信いたしますので、しばらくお待ちいただけますと幸いです。
        <br />
        <span className="text-accent">
          ※3営業日以内に当院からの返信がない場合には、お電話(TEL {CLINIC_TEL})にてお問い合わせ下さい。
        </span>
      </p>
    </FormPageShell>
  );
}
