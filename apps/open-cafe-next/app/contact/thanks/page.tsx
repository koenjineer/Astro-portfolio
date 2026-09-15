import type { Metadata } from "next";
import {
  ContactIntro,
  ContactPageShell,
} from "../_components/ContactPageShell";

export const metadata: Metadata = {
  title: "お問い合わせ完了",
};

/**
 * 実際にはフォームを送信しないので返信は届かないが、
 * 架空のカフェのデザイン再現を優先してFigmaの文言のまま置く（minami-dental-next と同じ判断）
 */
export default function ContactThanksPage() {
  return (
    <ContactPageShell
      breadcrumbItems={[
        { label: "お問い合わせ", href: "/contact/" },
        { label: "お問い合わせ完了" },
      ]}
    >
      <ContactIntro heading="送信が完了しました">
        お問い合わせありがとうございました。
        <br />
        3営業日以内に返信いたしますので、しばらくお待ちいただけますと幸いです。
      </ContactIntro>
    </ContactPageShell>
  );
}
