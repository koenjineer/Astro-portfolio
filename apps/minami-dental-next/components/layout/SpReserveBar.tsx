import Link from "next/link";
import { DevicesWideIcon } from "@/components/icons/DevicesWideIcon";
import { TelIcon } from "@/components/icons/TelIcon";
import { SP_MENU_KEEP_ACTIVE_ATTRIBUTE } from "@/components/layout/spMenuInert";
import { CLINIC_HOURS_NOTE, CLINIC_TEL } from "@/lib/clinic";

/**
 * SP画面下に固定の電話＋WEB予約バー（Figma: button-reserve-sp）。
 * PCのヘッダー（xl）より狭い幅で出す。SPにしかない部品なのでホバーは付けない
 */
export function SpReserveBar() {
  return (
    <>
      {/* バーの高さ分の空き。無いとフッターのコピーライトがバーの下に隠れる */}
      <div aria-hidden="true" className="h-[60px] shrink-0 xl:hidden" />

      {/* z-50：SPメニュー（z-30のヘッダー内）の上にも出す。Figmaでもメニューを開いた状態で下端に残っている */}
      {/* 印の属性：SPメニューを開いている間も、このバーだけは inert にせず操作できるままにする */}
      <div
        {...{ [SP_MENU_KEEP_ACTIVE_ATTRIBUTE]: "" }}
        className="fixed inset-x-0 bottom-0 z-50 h-[60px] border-t border-main bg-white/85 shadow-default xl:hidden"
      >
        {/* Figmaはバー自体に max-w 375px。背景は画面幅いっぱいに敷き、中身だけ幅を抑える */}
        <div className="mx-auto flex h-full max-w-[375px] items-center justify-between px-4 py-1.5">
          <div className="flex w-[170px] flex-col">
            {/* 電話発信リンクにしない理由は TelNumber と同じ（架空の番号が実在した場合の誤発信を避ける） */}
            <p className="flex items-center gap-1 text-xl/[1.3] font-bold text-main">
              <TelIcon className="size-[18px] shrink-0" />
              {CLINIC_TEL}
            </p>
            <p className="text-center text-[10px]/[1.5]">{CLINIC_HOURS_NOTE}</p>
          </div>

          <Link
            href="/reservation/"
            className="flex h-[47px] w-[157px] shrink-0 items-center justify-center gap-2.5 rounded-lg bg-main px-[15px] py-[5px] text-white"
          >
            <DevicesWideIcon className="h-7 w-[46px] shrink-0" />
            <span className="flex w-[66px] flex-col items-center gap-[3px] text-center font-bold">
              <span className="text-base/none">WEB予約</span>
              <span className="text-xs/none">はこちら</span>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
