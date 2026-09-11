"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import {
  FIELD_BORDER_COLOR_CLASS,
  FormField,
} from "@/components/form/FormField";
import { FormHeading } from "@/components/form/FormHeading";
import { SubmitButton } from "@/components/form/SubmitButton";

/** 項目・余白はWEB予約のフォームと同じ作り。Figmaでは5項目とも必須バッジ付き */
export function ContactForm() {
  const router = useRouter();

  /**
   * 送信しない理由はWEB予約と同じ（CLAUDE.mdの合意事項）。入力内容をどこにも送らず、完了ページへ移るだけ。
   * （action + method="get" にすると氏名・メールアドレスがURLに残るため使わない）
   * 必須項目は required のままなので、未入力ならブラウザがここに来る前に止める。
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/contact/thanks/");
  }

  return (
    <section className="flex flex-col items-center gap-10 lg:gap-[70px]">
      {/* SPはFigmaどおり「お問い合わせ／フォーム」の2行。PCは1行に収まるので改行しない */}
      <FormHeading>
        お問い合わせ
        <br className="lg:hidden" />
        フォーム
      </FormHeading>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-10 lg:gap-[70px]"
      >
        <div className={`w-full border-t ${FIELD_BORDER_COLOR_CLASS}`}>
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
          <FormField
            label="お問い合わせ内容"
            name="message"
            control="textarea"
            placeholder="ご自由にご記入ください。"
            required
          />
        </div>

        <SubmitButton />
      </form>
    </section>
  );
}
