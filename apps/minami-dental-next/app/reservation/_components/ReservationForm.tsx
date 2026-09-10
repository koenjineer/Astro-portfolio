"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { ChoiceGroup } from "@/components/form/ChoiceGroup";
import {
  FIELD_BORDER_COLOR_CLASS,
  FormField,
} from "@/components/form/FormField";
import { FormHeading } from "./FormHeading";
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
  const router = useRouter();

  /**
   * 架空の歯科医院のデモサイトなので送信先は作らない（CLAUDE.mdの合意事項）。
   * 入力内容をどこにも送らず、完了ページへ移動するだけにする。
   * （action + method="get" にすると氏名・メールアドレスがURLに残るため使わない）
   * 必須項目は required のままなので、未入力ならブラウザがここに来る前に止める。
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/reservation/thanks/");
  }

  return (
    <section className="flex flex-col items-center gap-10 lg:gap-[70px]">
      <FormHeading>予約フォーム</FormHeading>

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
          <FormField
            label="お問い合わせ内容"
            name="message"
            control="textarea"
            placeholder="ご自由にご記入ください。"
          />
        </div>

        {/* ルールセット「送信ボタン」：ホバーでmainに塗り、文字を白に反転。
            「送　信」の間はFigmaの原稿どおり全角スペース1つ（字間ではなく文字） */}
        <button
          type="submit"
          className="flex h-[38px] w-[273px] cursor-pointer items-center justify-center rounded-3xl border border-main bg-white text-sm/[normal] tracking-[0.08em] text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none lg:h-14 lg:w-[360px] lg:rounded-[28px] lg:text-base/[normal]"
        >
          送　信
        </button>
      </form>
    </section>
  );
}
