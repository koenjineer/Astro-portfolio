import { ChoiceGroup } from "@/components/form/ChoiceGroup";
import { FormField } from "@/components/form/FormField";
import { NoSendForm } from "@/components/form/NoSendForm";

const INQUIRY_TYPES = [
  "お店のご利用・ご予約について",
  "ギフト(贈り物)について",
  "アルバイト応募について",
  "その他",
];

/** Figmaの必須バッジどおり、電話番号だけ任意 */
export function ContactForm() {
  return (
    <NoSendForm thanksHref="/contact/thanks/">
      <ChoiceGroup
        label="お問い合わせ項目"
        name="inquiryType"
        options={INQUIRY_TYPES}
        // Figmaどおり先頭を選んだ状態で始める（ユーザー決定）
        defaultValue={INQUIRY_TYPES[0]}
        required
      />
      <FormField
        label="お名前"
        name="name"
        placeholder="山田太郎"
        autoComplete="name"
        required
      />
      <FormField
        label="メールアドレス"
        name="email"
        type="email"
        placeholder="example@mail.com"
        autoComplete="email"
        required
      />
      <FormField
        label="電話番号"
        name="tel"
        type="tel"
        placeholder="09012345678"
        autoComplete="tel"
      />
      <FormField
        label="お問い合わせ内容"
        name="message"
        control="textarea"
        placeholder="お問い合わせ内容を入力してください"
        required
      />
      <p className="text-sm/[1.5] text-main">
        当社は、お客様の個人情報の流出・漏洩の防止、その他個人情報の安全管理のために必要かつ適切な措置を講じるものとし、法令などに正当な理由がある場合を除き、お客様の同意なく目的外での利用および第三者への提供は行いません。
      </p>
    </NoSendForm>
  );
}
