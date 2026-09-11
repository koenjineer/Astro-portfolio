import { ContactInfoFields } from "@/components/form/ContactInfoFields";
import { FormField } from "@/components/form/FormField";
import { NoSendForm } from "@/components/form/NoSendForm";

/** Figmaでは5項目とも必須バッジ付き（お問い合わせ内容もWEB予約と違って必須） */
export function ContactForm() {
  return (
    <NoSendForm
      // SPはFigmaどおり「お問い合わせ／フォーム」の2行。PCは1行に収まるので改行しない
      heading={
        <>
          お問い合わせ
          <br className="lg:hidden" />
          フォーム
        </>
      }
      thanksHref="/contact/thanks/"
    >
      <ContactInfoFields />
      <FormField
        label="お問い合わせ内容"
        name="message"
        control="textarea"
        placeholder="ご自由にご記入ください。"
        required
      />
    </NoSendForm>
  );
}
