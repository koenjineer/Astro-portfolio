"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SubmitButton } from "@/components/form/SubmitButton";

interface NoSendFormProps {
  /** 送信ボタンを押した後に移る完了ページ（末尾スラッシュ付き） */
  thanksHref: string;
  /** 送信ボタンの上に並べる項目（入力欄・注意書き） */
  children: ReactNode;
}

/**
 * 送信しないフォームの外側（項目の縦並び＋送信ボタン）。
 * 送信の扱いをここ1か所にまとめ、ページごとに違う作りになる事故を防ぐ
 */
export function NoSendForm({ thanksHref, children }: NoSendFormProps) {
  const router = useRouter();

  /**
   * 架空のカフェのデモサイトなので送信先は作らない（CLAUDE.mdの技術スタック）。
   * 入力内容をどこにも送らず、完了ページへ移動するだけにする。
   *
   * onSubmit + preventDefault ではなく action に関数を渡す：onSubmit はJSが起動してから付くので、
   * 読み込み途中に送信ボタンを押すとブラウザ標準のGET送信になり、名前やメールアドレスがURLに出る。
   * action に関数を渡すと、書き出したHTMLの action には押しても何も送らない値が入る（/rules/nextjs-static-export.md）。
   * 必須項目は required のままなので、未入力ならブラウザがここに来る前に止める。
   */
  function goToThanksPage() {
    router.push(thanksHref);
  }

  return (
    <form
      action={goToThanksPage}
      className="flex w-full flex-col items-center gap-10"
    >
      <div className="flex w-full flex-col gap-10">{children}</div>
      <SubmitButton />
    </form>
  );
}
