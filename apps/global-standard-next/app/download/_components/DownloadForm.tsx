"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useId } from "react";
import { FormField } from "./FormField";

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
  const agreementId = useId();

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

      <div className="flex items-center gap-[10px]">
        {/* チェック済みの絵はFigmaのSVGをそのまま重ねる。未チェックは同じ1pxの枠線だけ */}
        <span className="relative inline-flex size-7 shrink-0 lg:size-8">
          <input
            id={agreementId}
            type="checkbox"
            name="agreement"
            required
            className="peer size-full cursor-pointer appearance-none border border-[#3e3e3e] bg-white"
          />
          <Image
            src="/images/download/checkbox-checked.svg"
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            loading="lazy"
            className="pointer-events-none absolute inset-0 size-full opacity-0 peer-checked:opacity-100"
          />
        </span>
        <label
          htmlFor={agreementId}
          className="cursor-pointer text-sm text-contrast lg:text-base"
        >
          {/* サイト内に個人情報保護方針ページが無いためリンクにしない（下線つきの文字だけ） */}
          <span className="font-bold underline">個人情報保護方針</span>
          に同意します。
        </label>
      </div>

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
