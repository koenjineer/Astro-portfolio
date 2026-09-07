import { Fragment } from "react";

/** Figmaどおりの2行固定。折り返しではなく改行位置が決まっている */
const HEADING_LINES = ["資料請求いただき", "ありがとうございました！"];

export function DownloadThanksCard() {
  return (
    <div className="flex flex-col gap-[34px] lg:gap-10">
      <h2 className="text-2xl leading-10 font-bold text-contrast lg:text-[32px] lg:leading-[48px]">
        {HEADING_LINES.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </h2>

      <div className="flex flex-col items-start gap-[14px] text-sm text-contrast">
        <p className="leading-6">資料は以下のリンクよりダウンロードください。</p>
        {/* 配布する資料ファイルが無いためリンクにしない（下線つきの文字だけ） */}
        <p className="text-main underline">資料のダウンロードリンクはこちら</p>
        <p className="leading-7">
          また、ご入力いただいたメールアドレスの方へもダウンロードリンクを送付しておりますので、ご確認いただけますと幸いです。
        </p>
      </div>
    </div>
  );
}
