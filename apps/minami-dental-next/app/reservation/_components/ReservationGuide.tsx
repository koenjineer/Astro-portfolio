import { TelNumber } from "@/components/layout/TelNumber";
import { CLINIC_HOURS_NOTE, CLINIC_TEL } from "@/lib/clinic";

const HEADING_CLASS =
  "text-xl/[1.5] font-bold tracking-[0.08em] lg:text-[28px]/[1.5]";

// 改行はFigmaの原稿どおり（Figmaでは1行ずつ別の段落。幅が足りない行はそのまま折り返す）
const TEL_NOTE =
  "お急ぎの方は電話での連絡がスムーズです。\n混雑状況によっては当日受診をご利用いただけない場合がございます。\nあらかじめご了承ください。";
const MAIL_NOTE = `【ご予約に関しての注意点】\nメールアドレスの入力間違いにより送信できない事が発生しておりますので、メールアドレスは正しくご入力下さい。\n※24時間以内に当院からの返信がない場合には、お電話(TEL ${CLINIC_TEL})にてお問い合わせ下さい。`;

/** 予約フォームの前の「お電話でのご予約/ご相談」「メールでのご予約/ご相談」 */
export function ReservationGuide() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-start gap-6">
        <h2 className={HEADING_CLASS}>お電話でのご予約/ご相談</h2>
        <div className="flex w-[261px] flex-col items-center">
          <TelNumber className="w-full" />
          <p className="w-full text-center text-xs/[1.5] text-main">
            {CLINIC_HOURS_NOTE}
          </p>
        </div>
        <p className="text-sm/[1.7] whitespace-pre-line">{TEL_NOTE}</p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className={HEADING_CLASS}>メールでのご予約/ご相談</h2>
        <p className="text-sm/[1.7] whitespace-pre-line">{MAIL_NOTE}</p>
      </section>
    </div>
  );
}
