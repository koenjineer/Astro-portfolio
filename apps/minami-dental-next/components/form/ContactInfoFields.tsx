import { FormField } from "@/components/form/FormField";

/**
 * お名前・フリガナ・電話番号・メールアドレスの4項目（WEB予約・お問い合わせで共通。Figmaではどちらも必須）。
 * placeholder や自動入力の指定まで同じなので、片方だけ直す事故を防ぐため1か所で持つ
 */
export function ContactInfoFields() {
  return (
    <>
      <FormField
        label="お名前"
        name="name"
        placeholder="山田　太郎"
        autoComplete="name"
        required
      />
      {/* フリガナに当たる自動入力の種類はHTMLに無いので autoComplete は付けない */}
      <FormField
        label="フリガナ"
        name="nameKana"
        placeholder="ヤマダ　タロウ"
        required
      />
      <FormField
        label="電話番号"
        name="tel"
        type="tel"
        placeholder="000-0000-0000"
        autoComplete="tel"
        required
      />
      <FormField
        label="メールアドレス"
        name="email"
        type="email"
        placeholder="xxx@example.com"
        autoComplete="email"
        required
      />
    </>
  );
}
