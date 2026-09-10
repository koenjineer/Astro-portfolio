import Link from "next/link";
import { DevicesWideIcon } from "@/components/icons/DevicesWideIcon";

/**
 * PC右端に固定の予約ボタン（Figma: button-reserve-fixed。上から170px）。
 * PCのヘッダー（xl）と同じ幅から出す。それより狭いとSP固定バーが同じ役目を持つ
 */
export function ReserveFixedButton() {
  return (
    // ルールセット「PC右端固定の予約ボタン」：ホバーでmain-darkに濃くする
    <Link
      href="/reservation/"
      className="fixed top-[170px] right-0 z-40 hidden h-[120px] w-[92px] flex-col items-center gap-[11px] rounded-l-[20px] bg-main px-[17px] py-5 text-center text-sm/[1.3] font-bold text-white transition-colors duration-300 hover:bg-main-dark focus-visible:bg-main-dark motion-reduce:transition-none xl:flex"
    >
      <DevicesWideIcon className="h-8 w-[52px] shrink-0" />
      <span>
        WEB予約
        <br />
        はこちら
      </span>
    </Link>
  );
}
