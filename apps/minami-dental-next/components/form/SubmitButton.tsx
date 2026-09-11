/**
 * フォームの送信ボタン（ルールセット「送信ボタン」）。ホバーでmainに塗り、文字を白に反転。
 * 「送　信」の間はFigmaの原稿どおり全角スペース1つ（字間ではなく文字）
 */
export function SubmitButton() {
  return (
    <button
      type="submit"
      className="flex h-[38px] w-[273px] cursor-pointer items-center justify-center rounded-3xl border border-main bg-white text-sm/[normal] tracking-[0.08em] text-main transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none lg:h-14 lg:w-[360px] lg:rounded-[28px] lg:text-base/[normal]"
    >
      送　信
    </button>
  );
}
