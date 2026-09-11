import { ChoiceGroup } from "@/components/form/ChoiceGroup";
import { ContactInfoFields } from "@/components/form/ContactInfoFields";
import { FormField } from "@/components/form/FormField";
import { NoSendForm } from "@/components/form/NoSendForm";
import { PreferredDates } from "./PreferredDates";

const VISIT_TYPES = ["初診", "再診"];

// 項目名はFigmaのとおり「診察内容」（ナビの「診療案内」とは別の言葉）
const TREATMENTS = [
  "虫歯",
  "被せ物がとれた",
  "歯科矯正",
  "咬み合わせ",
  "歯周病",
  "小児歯科",
  "入れ歯",
  "インプラント",
  "その他",
];

/**
 * 「ご連絡方法」の選択肢。Figmaには「メール」が選ばれた閉じた状態しか無く、
 * 開いた中身の指定が無い。ページの案内が「お電話」「メール」の2通りなので、その2つにしている
 */
const CONTACT_METHODS = ["メール", "電話"];

export function ReservationForm() {
  return (
    <NoSendForm heading="予約フォーム" thanksHref="/reservation/thanks/">
      <ContactInfoFields />
      <ChoiceGroup
        label="初診/再診"
        name="visitType"
        type="radio"
        options={VISIT_TYPES}
        required
      />
      <ChoiceGroup
        label="診察内容"
        name="treatments"
        type="checkbox"
        options={TREATMENTS}
        note="※(複数選択可)"
        required
      />
      <FormField
        label="ご連絡方法"
        name="contactMethod"
        control="select"
        options={CONTACT_METHODS}
        required
      />
      <PreferredDates />
      {/* WEB予約のFigmaでは必須バッジが無いので任意（お問い合わせでは必須） */}
      <FormField
        label="お問い合わせ内容"
        name="message"
        control="textarea"
        placeholder="ご自由にご記入ください。"
      />
    </NoSendForm>
  );
}
