"use client";

import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { FIELD_BORDER_COLOR_CLASS } from "@/components/form/FormField";
import { FormHeading } from "@/components/form/FormHeading";
import { SubmitButton } from "@/components/form/SubmitButton";

interface NoSendFormProps {
  /** 見出しの中身。FormHeading の children と同じ（改行の入れ方は FormHeading に書いてある） */
  heading: ReactNode;
  /** 送信ボタンを押した後に移る完了ページ（末尾スラッシュ付き） */
  thanksHref: string;
  /** 区切り線の枠の中に並べる項目 */
  children: ReactNode;
}

/**
 * 送信しないフォームの外側（見出し＋区切り線の枠＋送信ボタン）。WEB予約・お問い合わせで共通。
 * 送信の扱いをここ1か所にまとめ、ページごとに違う作りになる事故を防ぐ
 */
export function NoSendForm({ heading, thanksHref, children }: NoSendFormProps) {
  const router = useRouter();

  /**
   * 架空の歯科医院のデモサイトなので送信先は作らない（CLAUDE.mdの合意事項）。
   * 入力内容をどこにも送らず、完了ページへ移動するだけにする。
   * （action + method="get" にすると氏名・メールアドレスがURLに残るため使わない）
   * 必須項目は required のままなので、未入力ならブラウザがここに来る前に止める。
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(thanksHref);
  }

  return (
    <section className="flex flex-col items-center gap-10 lg:gap-[70px]">
      <FormHeading>{heading}</FormHeading>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-10 lg:gap-[70px]"
      >
        <div className={`w-full border-t ${FIELD_BORDER_COLOR_CLASS}`}>
          {children}
        </div>

        <SubmitButton />
      </form>
    </section>
  );
}
