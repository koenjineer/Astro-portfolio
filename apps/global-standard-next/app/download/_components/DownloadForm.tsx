"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { AgreementCheckbox } from "@/components/form/AgreementCheckbox";
import { FormField } from "@/components/form/FormField";

interface DownloadFormFieldDefinition {
  label: string;
  name: string;
  placeholder: string;
  type?: "text" | "email";
  required?: boolean;
}

const FIELDS: DownloadFormFieldDefinition[] = [
  { label: "会社名", name: "company", placeholder: "例）○○株式会社" },
  { label: "部署", name: "department", placeholder: "例）人事部" },
  {
    label: "お名前",
    name: "name",
    placeholder: "例）鈴木 一郎",
    required: true,
  },
  {
    label: "お名前（フリガナ）",
    name: "nameKana",
    placeholder: "例）スズキ　イチロウ",
    required: true,
  },
  {
    label: "メールアドレス",
    name: "email",
    placeholder: "例）info@example.com",
    type: "email",
    required: true,
  },
];

export function DownloadForm() {
  const router = useRouter();

  /**
   * 架空の会社のデモサイトなので送信先は作らない方針。
   * 入力内容をどこにも送らず、完了ページへ移動するだけにする。
   * （action + method="get" にすると氏名・メールアドレスがURLに残るため使わない）
   * 必須項目はrequiredのままなので、未入力ならブラウザがここに来る前に止める。
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/download/thanks");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-[34px] lg:gap-10"
    >
      <h2 className="w-full text-2xl font-bold text-contrast lg:text-[32px]">
        資料ダウンロード
      </h2>

      <div className="flex w-full flex-col gap-5 lg:gap-8">
        {FIELDS.map((field) => (
          <FormField key={field.name} {...field} />
        ))}
      </div>

      <AgreementCheckbox />

      {/* ルールセット「枠線+白背景」：ホバーで背景をmainで塗りつぶす */}
      <button
        type="submit"
        className="flex h-[65px] w-full cursor-pointer items-center justify-center border border-main bg-white text-sm text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none lg:h-[67px] lg:w-auto lg:min-w-[336px] lg:px-20 lg:text-base"
      >
        資料をダウンロードする
      </button>
    </form>
  );
}
