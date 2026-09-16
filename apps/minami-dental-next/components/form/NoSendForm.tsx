"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { FIELD_BORDER_COLOR_CLASS } from "@/components/form/FormField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { SectionHeading } from "@/components/heading/SectionHeading";

interface NoSendFormProps {
  /** 見出しの中身。SectionHeading の children と同じ（改行の入れ方は SectionHeading に書いてある） */
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
   * onSubmit + preventDefault ではなく関数の action にする。onSubmit だと書き出したHTMLの
   * <form> に action が無く、JSが動き出す前に送信すると氏名・メールアドレスがURLに付いて送られる。
   * 関数の action は書き出し時に「送信しても何も起きない」HTMLになる（/rules/nextjs-static-export.md）。
   * 必須項目は required のままなので、未入力ならブラウザがここに来る前に止める。
   */
  function goToThanks() {
    router.push(thanksHref);
  }

  return (
    <section className="flex flex-col items-center gap-10 lg:gap-[70px]">
      <SectionHeading>{heading}</SectionHeading>

      <form
        action={goToThanks}
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
