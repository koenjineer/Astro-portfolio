import type { Metadata } from "next";
import { CLINIC_TEL } from "@/lib/clinic";
import { ReservationPageShell } from "../_components/ReservationPageShell";

export const metadata: Metadata = {
  title: "WEB予約完了 | みなみ歯科",
};

/**
 * 実際にはフォームを送信しないので返信は届かないが、
 * 架空の歯科医院のデザイン再現を優先してFigmaの文言のまま置く（姉妹サイトのお問い合わせと同じ判断）
 */
export default function ReservationThanksPage() {
  return (
    <ReservationPageShell
      breadcrumbItems={[
        { label: "WEB予約", href: "/reservation/" },
        { label: "WEB予約完了" },
      ]}
    >
      <p className="text-sm/[1.7]">
        WEBよりご予約いただき誠にありがとうございます。
        <br />
        送信いただいた内容を確認して1営業日以内に返信いたします。
        <br />
        <span className="text-accent">
          ※1営業日以内に当院からの返信がない場合には、お電話(TEL {CLINIC_TEL})にてお問い合わせ下さい。
        </span>
      </p>
    </ReservationPageShell>
  );
}
