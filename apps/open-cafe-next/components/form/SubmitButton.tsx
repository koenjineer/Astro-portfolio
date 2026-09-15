import { Button } from "@/components/ui/Button";

/**
 * フォームの送信ボタン（Figma: button-submit）。形とホバーはデフォルトボタンと同じ。
 * 「送信」の字間はFigmaの16px（文字の大きさと同じ1文字分）
 */
export function SubmitButton() {
  return (
    <Button type="submit">
      <span className="tracking-[1em]">送信</span>
    </Button>
  );
}
