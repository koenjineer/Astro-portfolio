import Link from "next/link";

/**
 * 改行はFigmaの原稿どおり（PCは2行、SPは2文めが幅なりに折り返して3行になる）。
 * 実際にはフォームを送信しないためメールは届かないが、
 * 架空の会社のデザイン再現を優先してFigmaの文言のまま置く（資料ダウンロードと同じ判断）。
 */
const MESSAGE =
  "お問い合わせありがとうございました。\n2日以内に担当者からメールにてご連絡いたしますので、しばらくお待ちいただけますと幸いです。";

export function ContactThanks() {
  return (
    <div className="flex flex-col items-start gap-[14px] text-sm text-contrast">
      <p className="leading-6 whitespace-pre-line">{MESSAGE}</p>

      {/* ホバーはルールセットの「記事本文中のリンク」と同じ（文字をmain-darkに濃くする） */}
      <Link
        href="/"
        className="leading-6 text-main underline transition-colors duration-300 hover:text-main-dark focus-visible:text-main-dark motion-reduce:transition-none"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
