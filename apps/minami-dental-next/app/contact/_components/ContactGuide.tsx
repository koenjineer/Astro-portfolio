import { CLINIC_TEL } from "@/lib/clinic";

/**
 * フォームの前の案内。改行はFigmaの原稿どおり（Figmaでは1行ずつ別の段落。幅が足りない行はそのまま折り返す）。
 * 電話番号は文中の文字として出すだけで、発信リンクにはしない（架空の番号が実在した場合の誤発信を避けるため）
 */
export function ContactGuide() {
  return (
    <p className="text-sm/[1.7]">
      お急ぎの方は、お電話(TEL {CLINIC_TEL})での連絡がスムーズです。
      <br />
      以下のフォームからお問い合わせ頂いた場合、ご連絡が2～3日後になる場合がございます。
      <br />
      また、メールアドレスの入力間違いにより送信できない事が発生しておりますので、メールアドレスは正しくご入力下さい。
      <br />
      <span className="text-accent">
        ※3営業日以内に当院からの返信がない場合には、お電話(TEL {CLINIC_TEL})にてお問い合わせ下さい。
      </span>
    </p>
  );
}
