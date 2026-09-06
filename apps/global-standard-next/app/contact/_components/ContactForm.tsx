"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { AgreementCheckbox } from "@/components/form/AgreementCheckbox";
import { FormField } from "@/components/form/FormField";
import { COURSES } from "@/lib/courses";

interface ContactFormFieldDefinition {
  label: string;
  name: string;
  placeholder: string;
  control?: "input" | "select" | "textarea";
  type?: "text" | "email" | "tel";
  options?: string[];
  required?: boolean;
}

/**
 * 「ご用件」の選択肢。Figmaには閉じた状態しか無く中身の指定が無いので、
 * サービスページの3コース＋その他で組み立てる。コース名はlib/courses.tsから取って
 * サービス・導入事例と食い違わないようにする。
 */
const SUBJECT_OPTIONS = [
  ...COURSES.map((course) => `${course.title}について`),
  "その他のお問い合わせ",
];

const FIELDS: ContactFormFieldDefinition[] = [
  { label: "会社名", name: "company", placeholder: "例）○○株式会社" },
  {
    label: "お名前",
    name: "name",
    placeholder: "例）鈴木　一郎",
    required: true,
  },
  {
    label: "お名前（フリガナ）",
    name: "nameKana",
    placeholder: "例）スズキ　イチロウ",
    required: true,
  },
  {
    label: "電話番号",
    name: "tel",
    placeholder: "例）0312345678",
    type: "tel",
    required: true,
  },
  {
    label: "メールアドレス",
    name: "email",
    placeholder: "例）info@example.com",
    type: "email",
    required: true,
  },
  {
    label: "ご用件",
    name: "subject",
    placeholder: "ご選択ください",
    control: "select",
    options: SUBJECT_OPTIONS,
    required: true,
  },
  {
    label: "ご用件の詳細",
    name: "message",
    placeholder: "ご自由にご記入ください。",
    control: "textarea",
    required: true,
  },
];

export function ContactForm() {
  const router = useRouter();

  /**
   * 架空の会社のデモサイトなので送信先は作らない方針（資料ダウンロードと同じ）。
   * 入力内容をどこにも送らず、完了ページへ移動するだけにする。
   * （action + method="get" にすると氏名・メールアドレスがURLに残るため使わない）
   * 必須項目はrequiredのままなので、未入力ならブラウザがここに来る前に止める。
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/contact/thanks");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-10"
    >
      <div className="flex w-full flex-col items-center gap-10 lg:gap-[60px]">
        {/* Figmaでは見出しだけ中央寄せ。入力欄は列いっぱいに広がる */}
        <h2 className="text-2xl font-bold text-contrast">お問い合わせ</h2>

        <div className="flex w-full flex-col gap-5 lg:gap-8">
          {FIELDS.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </div>
      </div>

      <AgreementCheckbox />

      {/* ルールセット「枠線+白背景」：ホバーで背景をmainで塗りつぶす。
          「送　信」の間はFigmaの原稿どおり全角スペース1つ（字間ではなく文字） */}
      <button
        type="submit"
        className="flex h-[65px] w-[295px] cursor-pointer items-center justify-center border border-main bg-white text-sm text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none lg:h-[72px] lg:w-auto lg:min-w-[295px] lg:px-20 lg:text-base"
      >
        送　信
      </button>
    </form>
  );
}
